<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasEvents;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory, HasEvents; 

    protected $fillable = [
        'user_id',
        'department_id',
        'admin_id',
        'priority_id',
        'title',
        'description',
        'status_id',
        'is_admin_creation',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class, 'department_id');
    }

    public function user () 
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function priority () 
    {
        return $this->belongsTo(Priority::class, 'priority_id');
    }

    public function histories()
    {
        return $this->hasMany(History::class, 'ticket_id', 'id');
    }
    
    public function attachments () {
        return $this->hasMany(Attachment::class, 'ticket_id', 'id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class, 'ticket_id', 'id')->orderBy('updated_at', 'desc');
    }

    public function status () {
        return $this->belongsTo(Status::class, 'status_id');
    }

    public function admin () {
        return $this->belongsTo(User::class, 'admin_id');
    }

    

}
