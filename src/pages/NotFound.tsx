import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { useTheme } from "@/utils/ThemeContext";
import { ROUTES } from "@/utils/constants";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useTheme();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div class="py-4">
      <div className="flex items-center justify-center min-h-[80vh] bg-background">
        <div className="text-center max-w-md w-full p-8 card animate-fade-in">
          <h1 className="text-[10rem] font-bold text-muted-foreground opacity-30">404</h1>
          <h2 className="text-2xl font-bold mb-4 -mt-20">Oops! Page not found</h2>
          <p className="text-muted-foreground mb-6">
            La página que estás buscando no existe o ha sido movida.
          </p>
          <a 
            href={ROUTES.DASHBOARD} 
            className="btn btn-primary inline-block"
          >
            Return to Home
          </a>

          {/* Additional helpful information */}
          <div className="mt-12 text-sm text-muted-foreground">
            <p>Lost your way? Try these popular pages:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-4">
              <a
                href={ROUTES.DASHBOARD}
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
              >
                Dashboard
              </a>
              <span className="text-muted-foreground/50">•</span>
              <a
                href="/account"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
              >
                Profile
              </a>
              <span className="text-muted-foreground/50">•</span>
              <a
                href="/appearance"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
              >
                Settings
              </a>
            </div>
          </div>

          {/* Error code */}
          <div className="mt-8 text-xs text-muted-foreground/50">
            <p>Error code: {location.pathname}</p>
          </div>
        </div>
      </div>
    </div>


  );
};

export default NotFound;
