<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Http\Requests\StoreTicketRequest;
use App\Http\Requests\UpdateTicketRequest;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class TicketController extends Controller
{

    /**
     * @OA\Get(
     *     path="/api/tickets",
     *     tags={"Tickets"},
     *     summary="Get active tickets",
     *     description="Active tickets list with user's attempt count",
     *     security={{"bearerAuth": {}}},
     *
     *     @OA\Parameter(
     *         name="per_page",
     *         in="query",
     *         required=false,
     *         description="Number of items per page",
     *         @OA\Schema(type="integer", minimum=1, maximum=100, example=15)
     *     ),
     *
     *     @OA\Response(
     *         response=200,
     *         description="Tickets retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Tickets retrieved successfully"),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(
     *                     property="data",
     *                     type="array",
     *                     @OA\Items(ref="#/components/schemas/Ticket")
     *                 ),
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="per_page", type="integer", example=15),
     *                 @OA\Property(property="total", type="integer", example=10)
     *             )
     *         )
     *     ),
     *
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     ),
     *
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */


    public function index(Request $request)
    {
        try {

            $request->validate([
                'per_page' => 'nullable|integer|min:1|max:100',
            ]);

            $tickets = Ticket::query()
                ->withCount([
                    'attempts' => function ($query) {
                        $query->where('user_id', auth()->id());
                    }
                ])
                ->where('is_active', true);


            $perPage = $request->input('per_page');

            if ($perPage > 0) {
                $tickets = $tickets->paginate($perPage);
            } else {
                $tickets = $tickets->get();
            }

            return response()->json([
                'success' => true,
                'message' => 'Tickets retrieved successfully',
                'data' => $tickets
            ]);

        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
                'data' => []
            ]);
        }
    }


}
