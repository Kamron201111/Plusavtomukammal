<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Yhq;
use Illuminate\Http\Request;

class YhqController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/yhq",
     *     tags={"Rules & Info"},
     *     summary="Get YHQ Content",
     *     description="Returns the latest active YHQ document with nested categories and items.",
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="title", type="string", example="YHQ 2024"),
     *                 @OA\Property(
     *                     property="categories",
     *                     type="array",
     *                     @OA\Items(
     *                         type="object",
     *                         @OA\Property(property="id", type="integer", example=1),
     *                         @OA\Property(property="title", type="string", example="General Rules"),
     *                         @OA\Property(
     *                             property="items",
     *                             type="array",
     *                             @OA\Items(
     *                                 type="object",
     *                                 @OA\Property(property="id", type="integer", example=1),
     *                                 @OA\Property(property="content", type="string", example="Rule 1.1")
     *                             )
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $yhq = Yhq::with(['categories.items' => function ($query) {
                $query->where('is_active', true);
            }, 'categories' => function ($query) {
                $query->where('is_active', true);
            }])->where('is_active', true)->latest()->first();
            
            return response()->json([
                'success' => true,
                'data' => $yhq
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
                'data' => null
            ], 500);
        }
    }
}
