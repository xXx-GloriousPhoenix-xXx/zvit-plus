// // TemplateCreatePage.tsx
// import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
// import { MetaStep } from "../../docs/steps/MetaStep";
// import { EditorStep } from "../../docs/steps/EditorStep";
// import { ReviewStep } from "../../docs/steps/ReviewStep";
// import { 
//     setMeta, 
//     setTemplate, 
//     setStep, 
//     clearDraft
// } from "@/shared/api/templates/templateCreateSlice";
// import { createTemplate } from "@/shared/api/templates/createTemplateThunk";

// import cl from "./TemplateCreatePage.module.css";
// import { useNavigate } from "react-router-dom";

// export function TemplateCreatePage() {
//     const dispatch = useAppDispatch();
//     const { meta, template, step } = useAppSelector(s => s.templateCreate);
//     const navigate = useNavigate();

//     const handleClearDraft = () => {
//         if (window.confirm('Ви впевнені, що бажаєте очистити чернетку?')) {
//             dispatch(clearDraft());
//         }
//     };

//     const handleSubmit = async (canvasRef?: React.RefObject<HTMLDivElement | null>) => {
//         if (!meta) {
//             throw new Error("Відсутні метадані шаблону");
//         }

//         const templateData = {
//             name: meta.templateName,
//             templateTypeId: meta.templateTypeId,
//             isPrivate: meta.isPrivate || false,
//             template: template,
//             canvasRef: canvasRef
//         };

//         try {
//             const result = await dispatch(createTemplate(templateData)).unwrap();
//             console.log('Template created successfully:', result);
//             navigate('/templates');           
//         } catch (error: any) {
//             console.error('Failed to create template:', error);
//             throw error;
//         }
//     };

//     function renderStep(currentStep: number) {
//         switch (currentStep) {
//             case 1:
//                 return (
//                     <MetaStep
//                         value={meta}
//                         onNext={(data) => {
//                             dispatch(setMeta(data));
//                             dispatch(setStep(2));
//                         }}
//                     />
//                 );
//             case 2:
//                 return (
//                     <EditorStep
//                         template={template}
//                         onChange={(newTemplate) => dispatch(setTemplate(newTemplate))}
//                         onNext={() => dispatch(setStep(3))}
//                         onBack={() => dispatch(setStep(1))}
//                     />
//                 );
//             case 3:
//                 return (
//                     <ReviewStep
//                         template={template}
//                         onBack={() => dispatch(setStep(2))}
//                         onClearDraft={handleClearDraft}
//                         onSubmit={handleSubmit}

//                     />
//                 );
//             default:
//                 return null;
//         }
//     }

//     return (
//         <section className={cl.Wrapper}>
//             {renderStep(step)}
//         </section>
//     );
// }