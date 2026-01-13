import { useEffect, useRef, useState } from 'react'

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
type Position = { x: number; y: number }

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isUserControlled, setIsUserControlled] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Setup canvas size
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const gridSize = 20
    const cols = Math.floor(canvas.width / gridSize)
    const rows = Math.floor(canvas.height / gridSize)
    const margin = 5 // Safe margin from edges

    // Function to generate food within safe boundaries
    function generateFood(): Position {
      return {
        x: margin + Math.floor(Math.random() * (cols - margin * 2)),
        y: margin + Math.floor(Math.random() * (rows - margin * 2))
      }
    }

    // Game state - Initialize snake with 7 segments
    const startX = Math.floor(cols / 2)
    const startY = Math.floor(rows / 2)
    let snake: Position[] = []
    for (let i = 0; i < 7; i++) {
      snake.push({ x: startX - i, y: startY })
    }
    let direction: Direction = 'RIGHT'
    let food: Position = generateFood()
    let userControlled = false
    let frameId: number | null = null
    let lastTime = 0
    const frameDelay = 150 // milliseconds between moves
    let movesSinceLastTurn = 0 // Track moves to prevent zig-zag
    const minMovesBeforeTurn = 3 // Minimum moves before allowing direction change

    // Simple AI: chase food and avoid walls
    function getAIDirection(head: Position, currentDir: Direction, foodPos: Position): Direction {
      const margin = 5 // tiles from edge to consider turning

      // Calculate distance to food
      const distX = Math.abs(foodPos.x - head.x)
      const distY = Math.abs(foodPos.y - head.y)
      const distanceToFood = distX + distY

      // Allow free movement when close to food (within 5 tiles)
      const isCloseToFood = distanceToFood <= 5

      // Prevent zig-zag: keep current direction for a few moves (unless close to food)
      if (movesSinceLastTurn < minMovesBeforeTurn && !isCloseToFood) {
        // Check if current direction is still safe
        const isSafe =
          (currentDir === 'UP' && head.y > margin) ||
          (currentDir === 'DOWN' && head.y < rows - margin) ||
          (currentDir === 'LEFT' && head.x > margin) ||
          (currentDir === 'RIGHT' && head.x < cols - margin)

        if (isSafe) {
          return currentDir
        }
      }

      // Calculate direction to food
      const dx = foodPos.x - head.x
      const dy = foodPos.y - head.y

      // Prioritize directions towards food
      const priorities: Direction[] = []

      // Add horizontal direction
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) priorities.push('RIGHT')
        else if (dx < 0) priorities.push('LEFT')
        if (dy > 0) priorities.push('DOWN')
        else if (dy < 0) priorities.push('UP')
      } else {
        // Add vertical direction first
        if (dy > 0) priorities.push('DOWN')
        else if (dy < 0) priorities.push('UP')
        if (dx > 0) priorities.push('RIGHT')
        else if (dx < 0) priorities.push('LEFT')
      }

      // Filter out opposite direction and dangerous directions
      const safeDirs = priorities.filter(dir => {
        // Can't go opposite
        if (currentDir === 'UP' && dir === 'DOWN') return false
        if (currentDir === 'DOWN' && dir === 'UP') return false
        if (currentDir === 'LEFT' && dir === 'RIGHT') return false
        if (currentDir === 'RIGHT' && dir === 'LEFT') return false

        // Avoid edges
        if (dir === 'UP' && head.y <= margin) return false
        if (dir === 'DOWN' && head.y >= rows - margin) return false
        if (dir === 'LEFT' && head.x <= margin) return false
        if (dir === 'RIGHT' && head.x >= cols - margin) return false

        return true
      })

      // If we have safe directions towards food, use the first one
      if (safeDirs.length > 0) {
        return safeDirs[0]
      }

      // Fallback: keep current direction if safe
      const isSafe =
        (currentDir === 'UP' && head.y > margin) ||
        (currentDir === 'DOWN' && head.y < rows - margin) ||
        (currentDir === 'LEFT' && head.x > margin) ||
        (currentDir === 'RIGHT' && head.x < cols - margin)

      if (isSafe) return currentDir

      // Emergency: pick any safe direction
      const emergencyDirs: Direction[] = []
      if (head.y > margin && currentDir !== 'DOWN') emergencyDirs.push('UP')
      if (head.y < rows - margin && currentDir !== 'UP') emergencyDirs.push('DOWN')
      if (head.x > margin && currentDir !== 'RIGHT') emergencyDirs.push('LEFT')
      if (head.x < cols - margin && currentDir !== 'LEFT') emergencyDirs.push('RIGHT')

      return emergencyDirs[0] || currentDir
    }

    function gameLoop(timestamp: number) {
      if (timestamp - lastTime < frameDelay) {
        frameId = requestAnimationFrame(gameLoop)
        return
      }
      lastTime = timestamp

      // AI control
      if (!userControlled) {
        const newDirection = getAIDirection(snake[0], direction, food)

        // Track direction changes
        if (newDirection !== direction) {
          movesSinceLastTurn = 0
          direction = newDirection
        } else {
          movesSinceLastTurn++
        }
      } else {
        movesSinceLastTurn++
      }

      // Move snake
      const head = { ...snake[0] }

      switch (direction) {
        case 'UP': head.y--; break
        case 'DOWN': head.y++; break
        case 'LEFT': head.x--; break
        case 'RIGHT': head.x++; break
      }

      // Wrap around edges
      if (head.x < 0) head.x = cols - 1
      if (head.x >= cols) head.x = 0
      if (head.y < 0) head.y = rows - 1
      if (head.y >= rows) head.y = 0

      // Check collision with self
      const hitSelf = snake.some(segment => segment.x === head.x && segment.y === head.y)
      if (hitSelf) {
        // Reset game with 7 segments
        const resetX = Math.floor(cols / 2)
        const resetY = Math.floor(rows / 2)
        snake = []
        for (let i = 0; i < 7; i++) {
          snake.push({ x: resetX - i, y: resetY })
        }
        direction = 'RIGHT'
        food = generateFood()
      } else {
        snake.unshift(head)

        // Check food
        if (head.x === food.x && head.y === food.y) {
          food = generateFood()
        } else {
          snake.pop()
        }
      }

      // Render
      ctx.fillStyle = '#0a0a0a'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw food
      ctx.fillStyle = '#60a5fa'
      ctx.shadowBlur = 20
      ctx.shadowColor = '#60a5fa'
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2)

      // Draw snake
      ctx.shadowBlur = 10
      snake.forEach((segment, i) => {
        const opacity = 1 - (i / snake.length) * 0.5
        ctx.fillStyle = `rgba(139, 92, 246, ${opacity})`
        ctx.shadowColor = '#8b5cf6'
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2)
      })

      ctx.shadowBlur = 0

      frameId = requestAnimationFrame(gameLoop)
    }

    // Keyboard controls
    function handleKeyDown(e: KeyboardEvent) {
      const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']

      if (arrowKeys.includes(e.key)) {
        e.preventDefault()
        userControlled = true
        setIsUserControlled(true)

        switch (e.key) {
          case 'ArrowUp': if (direction !== 'DOWN') direction = 'UP'; break
          case 'ArrowDown': if (direction !== 'UP') direction = 'DOWN'; break
          case 'ArrowLeft': if (direction !== 'RIGHT') direction = 'LEFT'; break
          case 'ArrowRight': if (direction !== 'LEFT') direction = 'RIGHT'; break
        }
      }

      if (e.key === 'Escape') {
        e.preventDefault()
        userControlled = false
        setIsUserControlled(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    frameId = requestAnimationFrame(gameLoop)

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          zIndex: -1,
          pointerEvents: 'none',
          opacity: 0.6
        }}
        aria-hidden="true"
      />

      {/* Control hints */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1000
      }}>
        {isUserControlled ? (
          // ESC key visual
          <div style={{
            padding: '8px 16px',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.9), rgba(168, 85, 247, 0.8))',
            color: 'white',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            ESC
          </div>
        ) : (
          // Arrow keys visual
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            alignItems: 'center'
          }}>
            {/* Up arrow */}
            <div style={{
              width: '36px',
              height: '36px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(96, 165, 250, 0.7))',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold',
              boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              ▲
            </div>

            {/* Left, Down, Right arrows */}
            <div style={{
              display: 'flex',
              gap: '4px'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(96, 165, 250, 0.7))',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                ◀
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(96, 165, 250, 0.7))',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                ▼
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(96, 165, 250, 0.7))',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}>
                ▶
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
