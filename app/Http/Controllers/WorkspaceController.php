<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class WorkspaceController extends Controller
{
    /**
     * Switch user's active tenant workspace
     */
    public function switch(Request $request): RedirectResponse
    {
        $request->validate([
            'tenant_id' => ['required', 'exists:tenants,id'],
        ]);

        $user = $request->user();
        $targetTenantId = (int) $request->input('tenant_id');

        // Check permission: super admin can switch to any tenant, regular users only their memberships
        if (!$user->isSuperAdmin()) {
            $hasMembership = $user->memberships()
                ->where('tenant_id', $targetTenantId)
                ->where('membership_status', 'ACTIVE')
                ->exists();

            if (!$hasMembership) {
                return back()->with('error', 'Anda tidak memiliki akses ke workspace ini.');
            }
        }

        $request->session()->put('current_tenant_id', $targetTenantId);
        $user->update(['last_active_tenant_id' => $targetTenantId]);

        $tenant = Tenant::find($targetTenantId);

        return back()->with('success', "Workspace berhasil dialihkan ke {$tenant->name}.");
    }
}
