<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Priority;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TicketController extends Controller
{
    public function index () {
        $tickets = Ticket::with('department', 'user', 'priority', 'status', 'employee')
        ->orderBy('id', 'desc')
        ->get();
        
        //get adish depts
        $departments = Department::where('company_id', 1)
        ->get();

        return response()->json([
            'tickets' => $tickets, 
            'departments' => $departments]); 
    }

    public function userTickets (Request $request) {
        $userId = $request->query('userId'); 
        $tickets = Ticket::with('department', 'user', 'priority', 'status', 'employee')
                ->where('user_id', $userId)
                ->orderBy('id', 'desc')
                ->get();
        
        //get adish depts
        $departments = Department::where('company_id', 1)
        ->get();

        return response()->json([
            'tickets' => $tickets, 
            'departments' => $departments]); 
    }

    public function adminTickets (Request $request) {
        $adminId = $request->query('adminId'); 
        $tickets = Ticket::with('department', 'user', 'priority', 'status', 'employee')
                ->where('employee_id', $adminId)
                ->orderBy('id', 'desc')
                ->get();
        
        //get adish depts
        $departments = Department::where('company_id', 1)
        ->get();

        return response()->json([
            'tickets' => $tickets, 
            'departments' => $departments]); 
    }


    public function create () {
        //get adish depts
        $departments = Department::where('company_id', 1)
        ->get();

        //get employees
        $employees = User::where('company_id', 1)
        ->where('type_id', 1)
        ->get();

        //get priorities
        $priorities = Priority::all(); 

        return response()->json([
            'departments' => $departments,
            'employees' => $employees, 
            'priorities' => $priorities
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
            'employee_id' => $validated['selectedEmployee'],
            'priority_id' => $validated['selectedPriority'],
            'status_id' => 1, //newly created ticket
            'title' => $validated['titleInput'],
            'description' => $validated['descriptionInput'],
        ]); 

        if ($request->hasFile('filesInput')) {
            foreach ($request->file('filesInput') as $file) {
                $originalFileName = $file->getClientOriginalName(); 
                $path = $file->store('attachments', 'public'); 
        
                $attachment = new Attachment();
                $attachment->ticket_id = $newTicket->id;
                $attachment->file_name = $originalFileName; 
                $attachment->file_path = Storage::url($path); 
                $attachment->save();
            }
        }

        return response()->json(['message' => 'Data stored successfully', 'data' => $newTicket]); 

    }

    public function show ($id) {
        $ticket = Ticket::findOrFail($id)->load('priority', 'status', 'employee', 'user', 'department', 'attachments');

        return response()->json(['ticket' => $ticket]); 
    }
    
}
