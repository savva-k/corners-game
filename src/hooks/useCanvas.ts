import { useRef, useEffect } from 'react'

const useCanvas = (draw: (ctx: CanvasRenderingContext2D) => void) => {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {

        const context = canvasRef?.current?.getContext('2d')
        if (!context) {
            console.error("Canvas context is not present")
            return
        }
        draw(context)

    }, [draw])

    return canvasRef
}

export default useCanvas