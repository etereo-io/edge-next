import React, { createContext, useEffect, useState } from 'react'

import API from '@lib/api/api-endpoints'
import fetch from '@lib/fetcher'
import hasPermission from '@lib/permissions/has-permission';
import { useRouter } from 'next/router';
import useSWR from "swr";
import useUser from '../hooks/use-user';

export const MaintenanceContext = createContext<{enabled: boolean}>({
  enabled: false
})

export const MaintenanceProvider = ({ children } : any) => {
  const { user, finished } = useUser()
  
  const { data } = useSWR(finished ? API.maintenance : null, fetch)

  const router = useRouter()

  useEffect(() => {
    if (data && data.enabled) {
      if (!hasPermission(user, 'admin.access') && router.pathname !== '/maintenance' && router.pathname !== '/auth/login' && router.pathname !== '/auth/reset-password') {
        router.push({
          pathname: '/maintenance',
          query: {...router.query},
        }, '/maintenance')
      }
    }
  }, [data, router.pathname])

  return (
    <MaintenanceContext.Provider value={{ enabled: data ? data.enabled: false }}>
      { data && children }
    </MaintenanceContext.Provider>
  )
}
