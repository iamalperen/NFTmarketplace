//src/app/dashboard/page.tsx

'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { isAuthenticated } from '@/lib/auth';
import {useSession, signOut} from "next-auth/react";
import {SessionStatus} from "@/types/session";

const Dashboard = () => {
  const {data: session, status} = useSession();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [solanaWallet, setSolanaWallet] = useState('');
  const [userId, setUserId] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editSolanaWallet, setEditSolanaWallet] = useState('');
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  const user = session?.user;

  useEffect(() => {
    if (status === SessionStatus.UNAUTHENTICATED) {
      router.push('/login');
    } else {
      axios.get('/api/userinfo?email=' + user?.email).then(response => {
        const { username, email, solanaWallet, id } = response.data.user;
        setUsername(username);
        setEmail(email);
        setSolanaWallet(solanaWallet || '-');
        setUserId(id);
      }).catch(error => {
        console.error('Error fetching user info:', error);
      });
    }
  }, [router, user]);

  const handleLogout = async () => {
    await signOut();
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();

    axios.put('/api/userinfo', {
        email: editEmail || email,
        solanaWallet: editSolanaWallet || solanaWallet
        }).then(response => {
        const { email, solanaWallet } = response.data.user;
        setEmail(email);
        setSolanaWallet(solanaWallet);
        setEditMode(false);
        }).catch(error => {
        console.error('Error updating user info:', error);
    })
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
          <Button className="w-full mb-6 text-lg py-3" onClick={handleCollectionsClick}>My Collections</Button>
          <h2 className="text-2xl font-bold mb-6 text-center">Welcome, {username}</h2>
          {!editMode ? (
              <div className="space-y-4">
                <div>
                  <p><strong>Username:</strong> {username}</p>
                </div>
                <div>
                  <p><strong>Email:</strong> {email}</p>
                </div>
                <div>
                  <p><strong>Solana Wallet:</strong> <span className="break-all">{solanaWallet}</span></p>
                </div>
                <div>
                  <p><strong>User ID:</strong> <span className="break-all">{userId}</span></p>
                </div>
                <Button className="w-full" onClick={() => setEditMode(true)}>Edit Info</Button>
                <Button className="w-full" variant="destructive" onClick={handleLogout}>Logout</Button>
              </div>
          ) : (
              <form onSubmit={handleEdit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <Input
                      id="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      placeholder={email}
                  />
                </div>
                <div>
                  <label htmlFor="solanaWallet" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Solana Wallet</label>
                  <Input
                      id="solanaWallet"
                      value={editSolanaWallet}
                      onChange={(e) => setEditSolanaWallet(e.target.value)}
                      placeholder={solanaWallet}
                  />
                </div>
                <Button type="submit" className="w-full">Save</Button>
                <Button type="button" className="w-full" onClick={() => setEditMode(false)}>Cancel</Button>
              </form>
          )}
        </Card>
      </div>
  );
};

export default Dashboard;
