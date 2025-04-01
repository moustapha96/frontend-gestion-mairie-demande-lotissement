
import {
    PageMetaData,
    PasswordFormInput,
    TextFormInput,
    ThirdPartyAuth,
} from "@/components";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../AppContext";
import { Loader, Loader2 } from "lucide-react";
import logoutImg from "@/assets/images/other/logout.png";

const ActivatedAccount = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { urlApi } = useContext(AppContext);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    const [resultat, setResultat] = useState("");
    const [user , setUser] = useState(null);


    useEffect(() => {
        setTimeout(() => {
            onSubmit(token);
        }, 2000);

    }, [token])
    const onSubmit = async (token) => {
        try {
            setLoading(true);
            const response = await fetch(`${urlApi}user/activated-account/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            setLoading(false);
            console.log(response);
            if (!response.ok) {
                console.error(response);
                setResultat(response.statusText || 'Erreur lors de l\'activation du compte !');
                return;
            }

            const res = await response.json();
            setUser(res);
            setResultat('Activation reussie !');
            setTimeout(() => {
                navigate('/auth/sign-in');
            }, 2000);

        } catch (error) {
            setResultat('Erreur lors de l\'activation du compte !');
            setLoading(false);
            console.error(error);
        }
    }


    return (
        <>
            <PageMetaData title="Vérification de votre compte" />

            <div className="my-auto text-center">
                <h4 className="mb-4 text-2xl font-bold text-white">Vérification de votre compte</h4>

                <div className="flex items-start justify-center">

                    {loading &&
                        <Loader className="mr-2 text-primary hover:text-rougeLogo animate-spin" size={70} ></Loader>
                    }
                    {user && <span className="text-primary">{user.nom} {user.prenom}</span>}
                </div>

                <div className="flex items-start justify-center mb-4">
                    {resultat && <span className="text-primary">{resultat}</span>}
                </div>


            </div>
            <p className="shrink text-center text-zinc-200">
                Avez vouc deja u compte ?
                {user ? (
                    <Link to={`/auth/sign-in?email=${user.email}`} className="ms-1 text-primary">
                        <b>Se connecter</b>
                    </Link>
                ) : (
                    <Link to="/auth/sign-in" className="ms-1 text-primary">
                        <b>Se connecter</b>
                    </Link>
                )}
            </p>

        </>
    );
};

export default ActivatedAccount;
