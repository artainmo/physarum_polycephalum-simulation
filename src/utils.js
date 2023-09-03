export function drawLine(context, x1, y1, x2, y2)
{
    context.beginPath();
    context.moveTo(x1, y1); // Starting point
    context.lineTo(x2, y2); // Ending point
    context.stroke(); // Draw the line
    context.closePath();
}
