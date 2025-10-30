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
        $user = $request->user();

        $tickets = Ticket::with([
            'department:id,category',
            'user:id,first_name,last_name',
            'priority:id,category',
            'status:id,category',
            'admin:id,first_name,last_name'
        ])
        ->where('user_id', $user->id)
        ->orderBy('id', 'desc')
        ->paginate(10);

        return response()->json(['tickets' => $tickets]);
    }

    public function adminTickets (Request $request) {
        $user = $request->user();

        $tickets = Ticket::with([
            'department:id,category',
            'user:id,first_name,last_name',
            'priority:id,category',
            'status:id,category',
            'admin:id,first_name,last_name'
        ])
        ->adminTickets($user->id, $user->department_id)
        ->orderBy('id', 'desc')
        ->paginate(10);

        //get adish depts
        $departments = Department::all();

        return response()->json([
            'tickets' => $tickets,
            'departments' => $departments]);
    }


    public function create (Request $request) {
        //get adish depts
        $departments = Department::all();

        //get employees
        $employees = User::where('role', 'admin')->get();

        //get priorities
        $priorities = Priority::all();

        //get statuses
        $statuses = Status::all();

        //users for admin
        $user = $request->user();
        $users = User::where('department_id', $user->department_id)->get();

        return response()->json([
            'departments' => $departments,
            'employees' => $employees,
            'priorities' => $priorities,
            'statuses' => $statuses,
            'users' => $users
        ]);
    }

    public function store (Request $request) {
        $user = Auth::user();

        $validated = $request->validate([
            'authUser' => 'required|integer|exists:users,id',
            'selectedDepartment' => 'required|integer|exists:departments,id',
            'selectedEmployee' => '', //for unassigned option
            'selectedPriority' => 'required|integer|exists:priorities,id',
            'titleInput' => 'required|string|min:10',
            'descriptionInput' => 'required|string|min:10',
            'fileNames' => 'nullable|array|max:5',
            'filesInput.*' => 'file|mimes:jpeg,jpg,png,bmp,mp4,mov,doc,docx,pdf|max:50000',
            'selectedUser' => 'nullable|integer|exists:users,id',
        ]);

        if ($user->isAdmin()) {
            $newTicket = Ticket::create([
                'user_id' => $validated['selectedUser'],
                'department_id' => $validated['selectedDepartment'],
                'admin_id' => $validated['selectedEmployee'],
                'priority_id' => $validated['selectedPriority'],
                'status_id' => 1, //newly created ticket
                'is_admin_creation' => 'true',
                'title' => $validated['titleInput'],
                'description' => $validated['descriptionInput'],
            ]);
        }
        else {
            $newTicket = Ticket::create([
                'user_id' => $validated['authUser'],
                'department_id' => $validated['selectedDepartment'],
                'admin_id' => $validated['selectedEmployee'],
                'priority_id' => $validated['selectedPriority'],
                'status_id' => 1, //newly created ticket
                'title' => $validated['titleInput'],
                'description' => $validated['descriptionInput'],
            ]);
        }

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

        History::create([
            'ticket_id' => $newTicket->id,
            'user_id' => $user->id,
            'description' => 'Ticket has been created by ' . $user->first_name . ' ' . $user->last_name.   '.',
        ]);

        History::create([
            'ticket_id' => $newTicket->id,
            'user_id' => $user->id,
            'description' => 'Ticket has set its status to New by ' . $user->first_name . ' '. $user->last_name. '.',
        ]);

        return response()->json(['message' => 'Data stored successfully', 'data' => $newTicket]);
    }

    public function show ($id) {
        $ticket = Ticket::findOrFail($id)->load([
            'priority',
            'status',
            'admin',
            'user',
            'department',
            'attachments',
            'histories',
            'comments'
        ]);
        $ticket->comments->load(['user:id,first_name,last_name,profile_picture']);

        return response()->json(['ticket' => $ticket]);
    }

    public function update (Request $request, Ticket $ticket) {
        $validated = $request->validate([
            'department_id' => 'required|integer|exists:departments,id',
            'admin_id' => 'required|integer|exists:users,id',
            'priority_id' => 'required|integer|exists:priorities,id',
            'status_id' => 'required|integer|exists:statuses,id'
        ]);

        $ticket->update($validated);

        return response()->json(['message' => 'Data updated successfully', 'data' => $ticket]);

    }

}
