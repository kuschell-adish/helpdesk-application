<?php

namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\Priority;
use App\Models\Ticket;
use App\Models\User;
use App\Models\History;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

use App\Services\ImageUploadService;

class TicketController extends Controller
{
    protected $imageService;

    public function __construct(ImageUploadService $imageService)
    {
        $this->imageService = $imageService;
    }

    public function index (Request $request) {
        $user = $request->user();
        $userId = $user->id;
        $userDeptId = $user->department_id;
        $userRole = $user->role;

        $statusCounts = Ticket::select('status_id', DB::raw('count(*) as count'))
                        ->where('user_id', $userId)
                        ->groupBy('status_id')
                        ->get();

        $priorityCounts = Ticket::select('priority_id', DB::raw('count(*) as count'))
                        ->where('user_id', $userId)
                        ->groupBy('priority_id')
                        ->get();

        $userQuarterlyData = Ticket::selectRaw('EXTRACT (QUARTER from created_at) as quarter, count(*) as count')
                        ->where('user_id', $userId)
                        ->whereYear('created_at', now()->year)
                        ->groupByRaw('EXTRACT (QUARTER from created_at)')
                        ->get();

        if($userRole === "admin"){
            $comparisonQuarterlyData = Ticket::selectRaw('EXTRACT (QUARTER from created_at) as quarter, count(*) as count')
            ->where('department_id', $userDeptId)
            ->whereYear('created_at', date('Y'))
            ->groupByRaw('EXTRACT (QUARTER from created_at)')
            ->get();
        }
        else {
            $comparisonQuarterlyData = Ticket::selectRaw('EXTRACT (QUARTER from created_at) as quarter, count(*) as count')
            ->whereYear('created_at', date('Y'))
            ->groupByRaw('EXTRACT (QUARTER from created_at)')
            ->get();
        }

        return response()->json([
            'statusCounts' => $statusCounts,
            'priorityCounts' => $priorityCounts,
            'userQuarterlyData' => $userQuarterlyData,
            'comparisonQuarterlyData' => $comparisonQuarterlyData
        ]);
    }

    public function userTickets (Request $request) {
        $user = $request->user();
        $search = $request->input('search', '');
        $statusIds = $request->input('status_ids', []);
        $priorityIds = $request->input('priority_ids', []);
        $allStatus = $request->input('all_status') === '1' || $request->input('all_status') === true || $request->input('all_status') === 'true';
        $allPriority = $request->input('all_priority') === '1' || $request->input('all_priority') === true || $request->input('all_priority') === 'true';

        if (!is_array($statusIds)) {
            $statusIds = [];
        }
        if (!is_array($priorityIds)) {
            $priorityIds = [];
        }

        $query = Ticket::select([
            'id', 'user_id', 'department_id', 'priority_id',
            'status_id', 'admin_id', 'title', 'updated_at'
        ])
        ->with([
            'department:id,category',
            'priority:id,category',
            'status:id,category',
            'admin:id,first_name,last_name'
        ])
        ->where('user_id', $user->id);

        if ($search) {
            $query->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($search) . '%']);
        }

        if (!$allStatus && count($statusIds) > 0) {
            $query->whereIn('status_id', $statusIds);
        }

        if (!$allPriority && count($priorityIds) > 0) {
            $query->whereIn('priority_id', $priorityIds);
        }

        $tickets = $query->latest('id')->paginate(5);

        return response()->json(['tickets' => $tickets]);
    }

    public function adminTickets (Request $request) {
        $user = $request->user();
        $search = $request->input('search', '');
        $statusIds = $request->input('status_ids', []);
        $priorityIds = $request->input('priority_ids', []);
        $allStatus = $request->input('all_status') === '1' || $request->input('all_status') === true || $request->input('all_status') === 'true';
        $allPriority = $request->input('all_priority') === '1' || $request->input('all_priority') === true || $request->input('all_priority') === 'true';

        if (!is_array($statusIds)) {
            $statusIds = [];
        }
        if (!is_array($priorityIds)) {
            $priorityIds = [];
        }

        $query = Ticket::select([
            'id', 'user_id', 'department_id', 'priority_id',
            'status_id', 'admin_id', 'title', 'updated_at'
        ])
        ->with([
            'department:id,category',
            'priority:id,category',
            'status:id,category',
            'admin:id,first_name,last_name'
        ])
        ->adminTickets($user->id, $user->department_id);

        if ($search) {
            $query->whereRaw('LOWER(title) LIKE ?', ['%' . strtolower($search) . '%']);
        }

        if (!$allStatus && count($statusIds) > 0) {
            $query->whereIn('status_id', $statusIds);
        }

        if (!$allPriority && count($priorityIds) > 0) {
            $query->whereIn('priority_id', $priorityIds);
        }

        $tickets = $query->latest('id')->paginate(5);

        return response()->json(['tickets' => $tickets]);
    }


    public function create (Request $request) {
        $user = $request->user();

        $departments = Department::getCachedList();

        $priorities = Priority::getCachedList();

        $users = User::select('id', 'first_name', 'last_name')
                    ->where('department_id', $user->department_id)
                    ->where('is_active', true)
                    ->orderBy('first_name')
                    ->get();

        return response()->json([
            'departments' => $departments,
            'priorities' => $priorities,
            'users' => $users
        ]);
    }

    public function getEmployees ($departmentId) {
        $employees = User::select('id', 'first_name', 'last_name')
                        ->where('role', 'admin')
                        ->where('department_id', $departmentId)
                        ->where('is_active', true)
                        ->orderBy('first_name')
                        ->get();

        return response()->json([
            'employees' => $employees
        ]);
    }

    public function store (Request $request) {
        $user = Auth::user();

        $validated = $request->validate([
            'user_id' => 'integer|exists:users,id',
            'department_id' => 'required|integer|exists:departments,id',
            'admin_id' => 'nullable|integer|exists:users,id',
            'priority_id' => 'required|integer|exists:priorities,id',
            'title' => 'required|string|min:10',
            'description' => 'required|string|min:10',
            'filesInput.*' => 'file|mimes:jpeg,jpg,png,bmp,mp4,mov,doc,docx,pdf|max:50000',
        ]);

        $ticket = new Ticket();
        $ticket->status_id = 1;
        $ticket->fill($validated);
        $ticket->save();

        if ($request->hasFile('filesInput')) {
            foreach ($request->file('filesInput') as $file) {
                $originalFileName = $file->getClientOriginalName();
                $filePath = $this->imageService->upload(
                    $file,
                    'tickets/',
                    'ticket_'
                );

                $attachment = new Attachment();
                $attachment->ticket_id = $ticket->id;
                $attachment->file_name = $originalFileName;
                $attachment->file_path = $filePath;
                $attachment->save();
            }
        }

        History::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'description' => 'Ticket has been created by ' . $user->first_name . ' ' . $user->last_name.   '.',
        ]);

        History::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'description' => 'Ticket has set its status to New by ' . $user->first_name . ' '. $user->last_name. '.',
        ]);

        return response()->json(['message' => 'Data stored successfully', 'data' => $ticket]);
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
