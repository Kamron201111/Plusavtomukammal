<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SignCategory;

class SignCategoryController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/sign_category",
     *     tags={"Rules & Info"},
     *     summary="Get all Sign Categories with Signs",
     *     description="Returns all sign categories including their underlying signs.",
     *     security={{"bearerAuth": {}}},
     *     @OA\Response(
     *         response=200,
     *         description="Success",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(
     *                 property="data",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="title", type="string", example="Warning Signs"),
     *                     @OA\Property(
     *                         property="signs",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", example=1),
     *                             @OA\Property(property="title", type="string", example="Stop Sign")
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
            $sign_categories = SignCategory::with(['signs' => function ($query) {
                $query->where('is_active', true);
            }])->where('is_active', true)->get();
            
            return response()->json([
                'success' => true,
                'data' => $sign_categories
            ]);
        } catch (\Exception $exception) {
            return response()->json([
                'success' => false,
                'message' => $exception->getMessage(),
                'data' => []
            ], 500);
        }
    }
}
