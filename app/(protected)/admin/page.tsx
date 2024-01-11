"use client";

import { admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import FormSuccess from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminPage = () => {
  const role = useCurrentRole();

  const onServerActionClick = () => {
    admin()
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        }

        if (data.success) {
          toast.success(data.success);
        }
      })
  }
  
  const onApiRouteClick = () => {
    fetch("/api/admin")
      .then((response) => {
        if (response.ok) {
          toast.success("Allowed API Route!");
        } else {
          toast.error("Forbidden API Route!");
        }
      })
  }

  return (
    <div className="w-full h-full">
      <div className="container mx-auto p-4">
        <Card className="w-[600px] shadow-md">
          <CardHeader>
            <p className="text-2xl font-semibold text-center">🔑Admin</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <RoleGate allowedRole={UserRole.ADMIN}>
              <FormSuccess message="Only Admin user can see it." />
            </RoleGate>
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
              <p className="text-sm font-medium">Admin-only API Route</p>
              <Button onClick={onApiRouteClick}>Click to test</Button>
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
              <p className="text-sm font-medium">Admin-only Server Action</p>
              <Button onClick={onServerActionClick}>Click to test</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
