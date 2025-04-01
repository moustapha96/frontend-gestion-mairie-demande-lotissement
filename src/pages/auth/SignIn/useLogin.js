import { useAuthContext } from "@/context";
import { HttpClient } from "@/helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";
import { AppContext } from "../../../AppContext";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { urlApi } = useContext(AppContext);

  const [email, setEmail] = useState("");
  
  const { saveSession, user, isAuthenticated } = useAuthContext();

  const loginFormSchema = yup.object({
    email: yup.string().email("Veuillez entrer un email valide").required("Veuillez entrer votre email"),
    password: yup.string().required("Veuillez entrer votre mot de passe"),
  });

  const { control, handleSubmit , setValue  } = useForm({
    resolver: yupResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if(searchParams.has("email")) {
      setValue("email", searchParams.get("email"));
    }
  }, [searchParams]);

  // Modifier la logique de redirection par défaut
  const getDefaultRedirect = (userRole) => {
    if (userRole.includes("ROLE_ADMIN") || userRole.includes("ROLE_SUPER_ADMIN")) {
      return "/admin/dashboard";
    } else if (userRole.includes("ROLE_AGENT")) {
      return "/agent/dashboard";
    } else if (userRole.includes("ROLE_DEMANDEUR")) {
      return "/demandeur/dashboard";
    }
    return "/";
  };

  const redirectUrl = searchParams.get("redirectTo") ?? getDefaultRedirect(user?.roles || []);

  useEffect(() => {
    if (isAuthenticated && user) {
      const defaultPath = getDefaultRedirect(user?.roles);
      if (window.location.pathname === '/auth/sign-in') {
        navigate(defaultPath);
      }
    }
  }, [isAuthenticated, user, navigate]);

  const login = handleSubmit(async (values) => {
    setLoading(true);

    try {
      const response = await fetch(urlApi + "login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const res = await response.json();

      if (res.code === 401) {
        toast.error("Vos identifiants sont incorrects");
        return;
      }

      if (res.code === 403) {
        toast.error("Votre compte n'est pas actif");
        return;
      }

      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }

      if (res.token) {
        saveSession({
          token: res.token,
          user: res.user,
        });

        toast.success("Connexion réussie. Redirection...");

        // Utiliser la fonction getDefaultRedirect pour la redirection
        const redirectPath = getDefaultRedirect(res.user.roles);
        navigate(redirectPath);
      }

    } catch (e) {
      toast.error("Une erreur s'est produite lors de la connexion.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  });

  return { loading, login, control };
};

export default useLogin;