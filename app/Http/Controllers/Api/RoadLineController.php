<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RoadLine;

class RoadLineController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/road_line",
     *     tags={"Rules & Info"},
     *     summary="Get all Road Lines",
     *     description="Returns a list of all available road lines with descriptions.",
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
     *                     @OA\Property(property="title", type="string", example="Solid line"),
     *                     @OA\Property(property="description", type="string", example="Do not cross..."),
     *                     @OA\Property(property="image", type="string", example="/storage/lines/solid.png")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        try {
            $road_lines = RoadLine::all();
            
            return response()->json([
                'success' => true,
                'data' => $road_lines
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
