import { logoutAction } from "@/app/admin/actions";

export async function GET() {
  await logoutAction();
}
