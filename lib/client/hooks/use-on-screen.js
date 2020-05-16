import React from 'react'

function useOnScreen(ref, rootMargin = '0px') {
  const [isIntersecting, setIntersecting] = React.useState(false)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }
    return () => {
      if (observer && ref && ref.current) {
        // TODO: see that all the observers are being removed correctly
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return isIntersecting
}

export default useOnScreen
