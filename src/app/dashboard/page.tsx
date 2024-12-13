//src/app/dashboard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Skeleton from '@/components/Skeleton';
import { useSession, signOut } from 'next-auth/react';
import { SessionStatus } from '@/types/session';

const Dashboard = () => {
    const { data: session, status } = useSession();
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [editMode, setEditMode] = useState(false);
    const [editEmail, setEditEmail] = useState('');
    const [editSolanaWallet, setEditSolanaWallet] = useState('');
    const router = useRouter();

    const user = session?.user;

    useEffect(() => {
        if (status === SessionStatus.UNAUTHENTICATED) {
            router.push('/login');
        } else {
            const storedUserInfo = sessionStorage.getItem('userInfo');
            if (storedUserInfo) {
                setUserInfo(JSON.parse(storedUserInfo));
                setLoading(false);
            } else {
                fetchUserInfo();
            }
        }
    }, [router, user, status, fetchUserInfo]);

    const fetchUserInfo = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/api/userinfo?email=' + user?.email);
            const userData = response.data.user;
            setUserInfo(userData);
            sessionStorage.setItem('userInfo', JSON.stringify(userData));
        } catch (error) {
            console.error('Error fetching user info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        sessionStorage.removeItem('userInfo');
        await signOut();
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.put('/api/userinfo', {
                email: editEmail || userInfo.email,
                solanaWallet: editSolanaWallet || userInfo.solanaWallet,
            });
            const updatedUserInfo = response.data.user;
            setUserInfo(updatedUserInfo);
            sessionStorage.setItem('userInfo', JSON.stringify(updatedUserInfo));
            setEditMode(false);
        } catch (error) {
            console.error('Error updating user info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCollectionsClick = async () => {
        if (status === SessionStatus.AUTHENTICATED) {
            router.push('/studio/collections');
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-2xl p-8">
                <Button
                    className="w-full mb-6 text-lg py-3"
                    onClick={handleCollectionsClick}
                    disabled={loading}
                >
                    My Collections
                </Button>
                <h2 className="text-2xl font-bold mb-6 text-center">
                    Welcome,{' '}
                    {loading ? (
                        <Skeleton className="h-6 w-24 inline-block align-middle" />
                    ) : (
                        userInfo?.username
                    )}
                </h2>
                {!editMode ? (
                    <div className="space-y-4">
                        <div>
                            <strong>Username: </strong>
                            {loading ? (
                                <Skeleton className="h-6 w-36 inline-block align-middle" />
                            ) : (
                                userInfo?.username
                            )}
                        </div>
                        <div>
                            <strong>Email: </strong>
                            {loading ? (
                                <Skeleton className="h-6 w-48 inline-block align-middle" />
                            ) : (
                                userInfo?.email
                            )}
                        </div>
                        <div>
                            <strong>Solana Wallet: </strong>
                            {loading ? (
                                <Skeleton className="h-6 w-60 inline-block align-middle" />
                            ) : (
                                <span className="break-all">{userInfo?.solanaWallet || '-'}</span>
                            )}
                        </div>
                        <div>
                            <strong>User ID: </strong>
                            {loading ? (
                                <Skeleton className="h-6 w-60 inline-block align-middle" />
                            ) : (
                                userInfo?.id
                            )}
                        </div>
                        <Button className="w-full" onClick={() => setEditMode(true)} disabled={loading}>
                            Edit Info
                        </Button>
                        <Button
                            className="w-full"
                            variant="destructive"
                            onClick={handleLogout}
                            disabled={loading}
                        >
                            Logout
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleEdit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Email
                            </label>
                            <Input
                                id="email"
                                value={editEmail}
                                onChange={(e) => setEditEmail(e.target.value)}
                                placeholder={userInfo?.email}
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="solanaWallet"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                            >
                                Solana Wallet
                            </label>
                            <Input
                                id="solanaWallet"
                                value={editSolanaWallet}
                                onChange={(e) => setEditSolanaWallet(e.target.value)}
                                placeholder={userInfo?.solanaWallet || '-'}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            Save
                        </Button>
                        <Button type="button" className="w-full" onClick={() => setEditMode(false)}>
                            Cancel
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default Dashboard;
