import { useParams } from "react-router-dom";

import cl from './ProfilePage.module.css';
import { Button } from "@/shared/ui/Button/Button";
import { useProfileActions } from "@/shared/hooks/useProfileActions";
import { HeaderLine } from "@/shared/ui/HeaderLine/HeaderLine";
import { ItemList } from "@/shared/ui/ItemList/ItemList";
import { Pagination } from "@/shared/ui/Pagination/Pagination";
import { useAppSelector } from "@/app/store/hooks";
import { RolePriority, type GrantableRole } from "@/shared/api/auth/authSlice";
import { banUser, fetchUserByLogin, grantRole, type GetUserDTO } from "@/shared/api/user/thunks";
import { useEffect, useState } from "react";
import { Select } from "@/shared/ui/Select/Select";
import { StringToggle } from "@/shared/ui/StringToggle/StringToggle";

export function ProfilePage() {
    const { login } = useParams();
    const { auth } = useAppSelector(state => state);
    const [authorUser, setAuthorUser] = useState<GetUserDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            if (!login) return;
            
            setLoading(true);
            setError(null);
            try {
                const userData = await fetchUserByLogin(login);
                console.log(userData);
                setAuthorUser(userData);
            } catch (err: any) {
                setError(err.message || 'Не вдалося завантажити користувача');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, [login]);

    const [roleToGrant, setRoleToGrant] = useState<GrantableRole>('user');
    const [isBan, setBan] = useState<boolean>(true);
    const [canDo, setCanDo] = useState<boolean>(false);

    useEffect(() => {
        if (authorUser && auth.isAuth) {
            setBan(!authorUser.isBanned);
            setCanDo(RolePriority[auth.role] > RolePriority[authorUser.role]);
        }
    }, [authorUser, auth.isAuth])

    const {
        handleBack,
        templates,
        reports,
        handleTemplatePageChange,
        handleReportPageChange
    } = useProfileActions({ author: login! });

    const renderTemplates = () => {
        if (templates.items && !templates.loading) {
            const templatesCount = templates.items.length;
            if (templatesCount > 0)
            return (
                <>
                    <HeaderLine>Шаблони ({templatesCount})</HeaderLine>
                    <ItemList type="template" items={templates.items!} />
                    {templates.totalPages > 1 && templatesCount > 0 && (
                        <div className={cl.PaginationContainer}>
                            <Pagination
                                currentPage={templates.currentPage}
                                totalPages={templates.totalPages}
                                onPageChange={handleTemplatePageChange}
                            />
                        </div>
                    )}
                </>
            );
            else
            return (
                <HeaderLine>Нема створених шаблонів</HeaderLine>
            );
        }
        else {
            return <div>Loading...</div>
        }
    }
    const renderReports = () => {
        if (reports.items && !reports.loading) {
            const reportsCount = reports.items!.length;
            if (reportsCount > 0)
            return (
                <>
                    <HeaderLine>Звіти ({reportsCount})</HeaderLine>
                    <ItemList type="report" items={reports.items!} />
                    {reports.totalPages > 1 && reportsCount > 0 && (
                        <div className={cl.PaginationContainer}>
                            <Pagination
                                currentPage={reports.currentPage}
                                totalPages={reports.totalPages}
                                onPageChange={handleReportPageChange}
                            />
                        </div>
                    )}
                </>
            );
            else
            return (
                <HeaderLine>Нема створених Звітів</HeaderLine>
            );
        }
        else {
            return <div>Loading...</div>
        }
    }

    const handleConfirm = async () => {
        if (authorUser && auth.accessToken) {
            await banUser(authorUser.id, isBan, auth.accessToken);
            if (roleToGrant < auth.role) {
                await grantRole(authorUser.id, roleToGrant, auth.accessToken);
            }
        }
    }

    return (
        <section className={cl.Wrapper}>
            {
                canDo && (
                    <>
                        <HeaderLine>Операції над користуваем</HeaderLine>
                        <div className={cl.OperationWrapper}>
                            <Select
                                label='Роль'
                                value={roleToGrant}
                                options={[
                                    { label: 'Користувач', value: 'user' },
                                    { label: 'Модератор', value: 'mod' }
                                ]}
                                onChange={e => setRoleToGrant(e.target.value as GrantableRole)}
                            />
                            <StringToggle
                                label='Блокування'
                                options={[
                                    { value: 'true', label: 'Заблокувати' },
                                    { value: 'false', label: 'Розблокувати' }
                                ]}
                                value={`${isBan}`}
                                onChange={value => setBan(value === 'true')}
                            />
                            <Button
                                variant="secondary"
                                text="Застосувати"
                                onClick={handleConfirm}
                            />
                        </div>
                    </>
                )
            }
            {renderTemplates()}
            {renderReports()}
            <div className={cl.BackWrapper}>
                <Button
                    variant="secondary"
                    text="Назад"
                    onClick={handleBack}
                />
            </div>
        </section>
    );
}