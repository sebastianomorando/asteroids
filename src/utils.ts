
export const randomPolygon = (sides: number, radius: number) => {
    const points = Array<{ x: number; y: number; }>();
    for (let i = 0; i < sides; i++) {
        const x = radius * Math.cos((2 * Math.PI * i) / sides) + ((Math.random() - 0.5) * radius * 0.6);
        const y = radius * Math.sin((2 * Math.PI * i) / sides) + ((Math.random() - 0.5) * radius * 0.6);
        points.push({ x, y });
    }
    return points;
};

export const regularPolygon = (sides: number, radius: number) => {
    const points = Array<{ x: number; y: number; }>();
    for (let i = 0; i < sides; i++) {
        const x = radius * Math.cos((2 * Math.PI * i) / sides);
        const y = radius * Math.sin((2 * Math.PI * i) / sides);
        points.push({ x, y });
    }
    return points;
}

export const drawPolygon = (ctx: CanvasRenderingContext2D, points: Array<{ x: number; y: number; }>) => {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.closePath();
    ctx.stroke();
};

export const lerp = (A:number,B:number,t:number) =>A+(B-A)*t;

export interface Point{
    x:number;
    y:number;
}

export function getIntersection(A: Point,B: Point,C: Point,D: Point){ 
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}


export function polysIntersect(poly1:Array<Point>, poly2:Array<Point>){
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

export const pointInPolygon = (point: Point, polygon: Array<Point>) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) != (yj > point.y))
            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}