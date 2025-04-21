<?php

namespace App\Observers;

use App\Models\Ticket;
use App\Models\History;
use App\Models\Priority;
use App\Models\Status;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class TicketObserver
{
    public function updating(Ticket $ticket)
    {
        $user = Auth::user();
        $userFullName = $user ? $user->first_name . ' ' . $user->last_name : 'Unknown';

        $changes = [];

        //status has changed
        if ($ticket->isDirty('status_id')) {
            $oldStatusId = $ticket->getOriginal('status_id');
            $newStatusId = $ticket->status_id;

            $oldStatus = Status::find($oldStatusId);
            $oldStatusName = $oldStatus ? $oldStatus->category : 'Unknown';

            $newStatus = Status::find($newStatusId);
            $newStatusName = $newStatus ? $newStatus->category : 'Unknown';

            $changes[] = "Ticket status has changed from {$oldStatusName} to {$newStatusName} by {$userFullName}.";
        }

        //priority has changed
        if ($ticket->isDirty('priority_id')) {
            $oldPriorityId = $ticket->getOriginal('priority_id');
            $newPriorityId = $ticket->priority_id;

            $oldPriority = Priority::find($oldPriorityId);
            $oldPriorityName = $oldPriority ? $oldPriority->category : 'Unknown';

            $newPriority = Priority::find($newPriorityId);
            $newPriorityName = $newPriority ? $newPriority->category : 'Unknown';

            $changes[] = "Ticket priority has changed from {$oldPriorityName} to {$newPriorityName} by {$userFullName}.";
        }

        //employee assigned has changed
        if ($ticket->isDirty('employee_id')) {
            $oldEmployeeId = $ticket->getOriginal('employee_id');
            $newEmployeeId = $ticket->employee_id;

            $oldEmployee = User::find($oldEmployeeId);
            $oldEmployeeFullName = $oldEmployee ? $oldEmployee->first_name . ' ' . $oldEmployee->last_name : 'Unassigned';

            $newEmployee = User::find($newEmployeeId);
            $newEmployeeFullName = $newEmployee ? $newEmployee->first_name . ' ' . $newEmployee->last_name : 'Unknown';

            $changes[] = "Ticket has been assigned to {$newEmployeeFullName} from {$oldEmployeeFullName} by {$userFullName}.";
        }

        foreach ($changes as $description) {
            History::create([
                'ticket_id' => $ticket->id,
                'user_id' => $user->id,
                'description' => $description,
            ]);
        }
    }

}