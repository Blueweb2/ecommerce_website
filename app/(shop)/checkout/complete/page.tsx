import { redirect } from "next/navigation";

export default function CheckoutCompleteRedirectPage() {
  redirect("/checkout/success");
}
