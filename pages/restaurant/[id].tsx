import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function RestaurantRedirect() {
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    if (id && typeof id === 'string') {
      router.replace(`/business/${id}`)
    } else if (router.isReady) {
      router.replace('/explore')
    }
  }, [id, router.isReady, router])

  return null
}
