<?php

namespace Database\Seeders;

use App\Models\User\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            [
                'role'     => 'Admin',
                'name'     => 'PlusAvto Admin',
                'username' => 'admin',
                'email'    => 'admin@plusavto.uz',
                'password' => Hash::make('PlusAvto2026'),
            ],
            [
                'role'     => 'Client',
                'name'     => 'Test User',
                'username' => 'testuser',
                'email'    => 'user@plusavto.uz',
                'phone'    => '998901234567',
                'password' => Hash::make('user123'),
            ],
        ];

        foreach ($users as $userData) {
            $role = $userData['role'];
            $attributes = array_diff_key($userData, ['role' => null]);
            $user = User::query()->updateOrCreate(
                ['email' => $attributes['email']],
                $attributes
            );
            $user->assignRole($role);
        }
    }
}
