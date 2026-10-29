<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class EventStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'events' => ['required', 'array', 'max:100'],
            'events.*.event_id' => ['required', 'string'],
            'events.*.event_name' => ['required', 'string', 'max:100'],
            'events.*.distinct_id' => ['required', 'string', 'max:255'],
            'events.*.user_id' => ['nullable'],
            'events.*.session_id' => ['nullable', 'string', 'max:100'],
            'events.*.timestamp' => ['required', 'date'],
            'events.*.source' => ['sometimes', 'in:browser,server'],
            'events.*.properties' => ['nullable', 'array'],
            'events.*.context' => ['nullable', 'array'],
        ];
    }
}
