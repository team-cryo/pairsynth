type range = {center: number, octaves: number} | {center: number, min: number} | {center: number, max: number} | {min: number, max: number} | {min: number, up: number} | {down: number, max: number};

function rangeCenter(range: number | range): number
{
    if(typeof(range) === "number")
        return range;
    return ("center" in range) ? range.center : 2**(rangeCenterLog2(range));
}
function rangeCenterLog2(range: number | range): number
{
    if(typeof(range) === "number")
        return Math.log2(range);
    return ("center" in range) ? Math.log2(range.center) : (((rangeMinLog2(range) + rangeMaxLog2(range))/2));
}
function rangeMax(range: number | range): number
{
    if(typeof(range) === "number")
        return range;
    return ("max" in range) ? range.max : 2**(rangeMaxLog2(range));
}
function rangeMaxLog2(range: number | range): number
{
    if(typeof(range) === "number")
        return Math.log2(range);
    if("max" in range)
    {
        return Math.log2(rangeMax(range));
    }
    else if("center" in range)
    {
        return rangeCenterLog2(range) + rangeOctaves(range);
    }
    else
    {
        return rangeMinLog2(range) + rangeOctaves(range)*2;
    }
}
function rangeMin(range: number | range): number
{
    if(typeof(range) === "number")
        return range;
    return ("min" in range) ? range.min : 2**(rangeMinLog2(range));
}
function rangeMinLog2(range: number | range): number
{
    if(typeof(range) === "number")
        return Math.log2(range);
    if("min" in range)
    {
        return Math.log2(rangeMin(range));
    }
    else if("center" in range)
    {
        return rangeCenterLog2(range) - rangeOctaves(range);
    }
    else
    {
        return rangeMaxLog2(range) - rangeOctaves(range)*2;
    }
}

function rangeOctaves(range: number | range): number
{
    if(typeof(range) === "number")
        return 0;
    if("octaves" in range)
    {
        return range.octaves;
    }
    else if("down" in range)
    {
        return range.down/2; 
    }
    else if("up" in range)
    {
        return range.up/2; 
    }
    else if("center" in range)
    {
        return Math.abs("min" in range ? rangeMinLog2(range) : (rangeMaxLog2(range)) - rangeCenterLog2(range));
    }
    else
    {
        return (rangeMaxLog2(range) - rangeMinLog2(range))/2
    }
}