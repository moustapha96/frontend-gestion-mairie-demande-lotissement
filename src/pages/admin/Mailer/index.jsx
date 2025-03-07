import { AdminBreadcrumb } from "@/components";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { Loader } from 'lucide-react';
import { sendSimpleMail } from "@/services/mailerService";
import { toast } from "sonner";
import CreatableSelect from 'react-select/creatable';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';


const schema = yup.object({
    recipients: yup.array().of(
        yup.object().shape({
            value: yup.string().email("Adresse mail invalide"),
            label: yup.string()
        })
    ).min(1, "adminMailer.emailRequired").required("L'adresse mail est obligatoire"),
    sujet: yup.string().required("l'objet est obligatoire"),
    // message: yup.string().required("adminMailer.messageRequired"),
}).required();

const AdminMailer = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editorContent, setEditorContent] = useState('');

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            recipients: [],
            sujet: '',
            // message: '',
        }
    });


    const onSubmit = async (data) => {
        setLoading(true);
        setError(null);
        const emailAddresses = data.recipients.map(recipient => recipient.value);
        console.log(emailAddresses);
        const body = { ...data, emails: emailAddresses, message: editorContent };
        console.log(body)
        try {
            const response = await sendSimpleMail(body);
            toast.success(response);
            setEditorContent('');
            reset();
        } catch (err) {
            setError(err.message);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? '#0369a1' : '#e5e7eb', // Utilisation de la couleur blueLogo
            boxShadow: state.isFocused ? '0 0 0 1px #0369a1' : 'none',
            '&:hover': {
                borderColor: '#0369a1',
            },
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#e0f2fe', // Couleur de fond plus claire
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#0369a1', // Couleur blueLogo
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#0369a1',
            ':hover': {
                backgroundColor: '#0ea5e9',
                color: 'white',
            },
        }),
    };

    const validateEmail = (email) => {
        return yup.string().email().isValidSync(email);
    };

    const toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        ['blockquote', 'code-block'],
        ['link', 'image', 'video', 'formula'],

        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'list': 'check' }],
        [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction

        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'font': [] }],
        [{ 'align': [] }],

        ['clean']                                         // remove formatting button
    ];
    const module = {
        toolbar: toolbarOptions,
    }

    return (
        <>
            <AdminBreadcrumb title={"Envoyer un mail"} />
            <section>
                <div className="container">
                    <div className="my-6 space-y-6">
                        <div className="grid grid-cols-1">
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                                    <h4 className="text-xl font-semibold text-gray-800 uppercase">{"Envoyer de mail"}</h4>
                                </div>

                                <div className="max-w-3xl mx-auto px-4 py-8 bg-white shadow-md rounded-md">
                                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                        <div>
                                            <label htmlFor="recipients" className="block text-sm font-medium text-gray-700">{"Destinataire"}</label>
                                            <Controller
                                                name="recipients"
                                                control={control}

                                                render={({ field }) => (
                                                    <CreatableSelect
                                                        {...field}
                                                        isMulti
                                                        options={[]}
                                                        placeholder={"Entrez un email"}
                                                        noOptionsMessage={() => "typeToAddEmail"}
                                                        className="mt-1 focus:outline-none focus:ring-primary focus:border-primary"
                                                        styles={customStyles}
                                                        formatCreateLabel={(inputValue) => `${"Ajouter"} "${inputValue}"`}
                                                        isValidNewOption={(inputValue) => validateEmail(inputValue)}
                                                    />
                                                )}
                                            />
                                            {errors.recipients && <p className="mt-2 text-sm text-red-500">{t(errors.recipients.message)}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="sujet" className="block text-sm font-medium text-gray-700">{"Sujet"}</label>
                                            <Controller
                                                name="sujet"
                                                control={control}
                                                render={({ field }) => (
                                                    <input
                                                        {...field}
                                                        type="text"
                                                        id="sujet"
                                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                                                    />
                                                )}
                                            />
                                            {errors.sujet && <p className="mt-2 text-sm text-red-500">{errors.sujet.message}</p>}
                                        </div>


                                        <div>
                                            <Controller
                                                name="message"
                                                control={control}
                                                render={({ field }) => (

                                                    <ReactQuill
                                                        theme="snow"
                                                        value={editorContent}
                                                        modules={module}
                                                        onChange={setEditorContent}
                                                        className="custom-quill-editor"
                                                    />

                                                )}
                                            />
                                            {errors.message && <p className="mt-2 text-sm text-red-500">{errors.message.message}</p>}
                                        </div>




                                        <div className="flex justify-end space-x-4">
                                            <button
                                                type="button"
                                                onClick={() => reset()}
                                                disabled={loading}
                                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none  "
                                            >
                                                {"Annuler"}
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={loading || isSubmitting}
                                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-light focus:outline-none  "
                                            >
                                                <span className="flex items-center">
                                                    {loading || isSubmitting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                                                    {"Envoyer"}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default AdminMailer;

