<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Priority;
use App\Models\Status;
use App\Models\Ticket;
use App\Models\User;
use App\Models\History;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

use App\Services\ImageUploadService;

class TicketController extends Controller
{
    protected $imageService;

    public function __construct(ImageUploadService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index () {
        $tickets = Ticket::with('department', 'user', 'priority', 'status', 'admin')
        ->orderBy('id', 'desc')
        ->get();
        
        //get adish depts
        $departments = Department::all();

        return response()->json([
            'tickets' => $tickets, 
            'departments' => $departments]); 
    }

    public function userTickets (Request $request) {
        $userId = $request->query('userId'); 
        $tickets = Ticket::with('department', 'user', 'priority', 'status', 'admin')
                ->where('user_id', $userId)
                ->orderBy('id', 'desc')
                ->get();
        
        //get adish depts
        $departments = Department::all();

        return response()->json([
            'tickets' => $tickets, 
            'departments' => $departments]); 
    }

    public function adminTickets (Request $request) {
        $adminId = $request->query('adminId'); 
        $deptId = $request->query('deptId'); 

        $tickets = Ticket::with('department', 'user', 'priority', 'status', 'admin')
            ->where(function($query) use ($adminId, $deptId) {
            $query->where('admin_id', $adminId)
                ->orWhere(function($query) use ($deptId) {
                    $query->whereNull('admin_id')
                        ->where('department_id', $deptId);
                });
        })
        ->orderBy('id', 'desc')
        ->get();
        
        //get adish depts
        $departments = Department::all();

        return response()->json([
            'tickets' => $tickets, 
            'departments' => $departments]); 
    }


    public function create () {
        //get adish depts
        $departments = Department::all();

        //get employees
        $employees = User::where('role', 'admin')->get();

        //get priorities
        $priorities = Priority::all(); 

        //get statuses
        $statuses = Status::all(); 

        return response()->json([
            'departments' => $departments,
            'employees' => $employees, 
            'priorities' => $priorities, 
            'statuses' => $statuses
        ]);
    }

    public function store (Request $request) {
        $validated = $request->validate([
            'authUser' => 'required|integer|exists:users,id',
            'selectedDepartment' => 'required|integer|exists:departments,id',
            'selectedEmployee' => '', //for unassigned option
            'selectedPriority' => 'required|integer|exists:priorities,id',
            'titleInput' => 'required|string|min:10',
            'descriptionInput' => 'required|string|min:10',
            'fileNames' => 'nullable|array|max:5',
            'filesInput.*' => 'file|mimes:jpeg,jpg,png,bmp,mp4,mov,doc,docx,pdf|max:50000'
        ]);

        $newTicket = Ticket::create([
            'user_id' => $validated['authUser'],
            'department_id' => $validated['selectedDepartment'],
            'admin_id' => $validated['selectedEmployee'],
            'priority_id' => $validated['selectedPriority'],
            'status_id' => 1, //newly created ticket
            'title' => $validated['titleInput'],
            'description' => $validated['descriptionInput'],
        ]); 

        if ($request->hasFile('filesInput')) {
            foreach ($request->file('filesInput') as $file) {
                $originalFileName = $file->getClientOriginalName(); 
                $filePath = $this->imageService->upload(
                    $file,
                    'tickets/', 
                    'ticket_'
                );
        
                $attachment = new Attachment();
                $attachment->ticket_id = $newTicket->id;
                $attachment->file_name = $originalFileName; 
                $attachment->file_path = $filePath;
                $attachment->save();
            }
        }

        $user = Auth::user();

        History::create([
            'ticket_id' => $newTicket->id,
            'user_id' => $user->id,
            'description' => 'Ticket has been created by ' . $user->name . '.',
        ]);

        History::create([
            'ticket_id' => $newTicket->id,
            'user_id' => $user->id,
            'description' => 'Ticket has set its status to New by ' . $user->name . '.',
        ]);

        return response()->json(['message' => 'Data stored successfully', 'data' => $newTicket]);

    }

    public function show ($id) {
        $ticket = Ticket::findOrFail($id)->load('priority', 'status', 'admin', 'user', 'department', 'attachments');

        return response()->json(['ticket' => $ticket]); 
    }

    public function update (Request $request, Ticket $ticket) {
        $validated = $request->validate([
            'selectedDepartment' => 'required|integer|exists:departments,id',
            'selectedEmployee' => 'required|integer|exists:users,id', 
            'selectedPriority' => 'required|integer|exists:priorities,id',
            'selectedStatus' => 'required|integer|exists:statuses,id'
        ]);

        $ticket->update([
            'department_id' => $validated['selectedDepartment'],
            'employee_id' => $validated['selectedEmployee'],
            'priority_id' => $validated['selectedPriority'],
            'status_id' => $validated['selectedStatus'],
        ]);

        return response()->json(['message' => 'Data updated successfully', 'data' => $ticket]);
    
    }
    
}
