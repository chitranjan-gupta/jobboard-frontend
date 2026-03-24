import "@/app/globals.css";
import Providers from "@/components/Providers";
import MainLayout from "@/components/MainLayout";


export const metadata = {
  title: "JobBoard",
  description: "Advanced Job Board",
};

export default function LocaleLayout({ children }) {
  return (
    <Providers>
      <MainLayout>
        {children}
      </MainLayout>
    </Providers>
  );
}
