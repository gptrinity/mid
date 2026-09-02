import { useEffect, useRef, useCallback } from 'react'

export function useScrollAnimation(threshold = 0.1, rootMargin = '0px 0px -50px 0px') {
  const ref = useRef<HTMLDivElement>(null)

  const observe = useCallback(() => {
    const el = ref.current
    if (!el) return

    // On mobile (< 768px), skip scroll animations for better UX
    if (window.innerWidth < 768) {
      const elements = el.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale')
      elements.forEach(child => child.classList.add('visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )

    const elements = el.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale')
    elements.forEach(child => observer.observe(child))

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  useEffect(() => {
    const cleanup = observe()
    return cleanup
  }, [observe])

  return ref
}
