// mm/hour
const rainfallRate = 5;

// mm
const dropRadius = 1;
const dropVolume = (4 / 3) * Math.PI * dropRadius ** 2;

const areaWidth = 10;
const areaLength = 10;

const cubeMmtoCubeM = (mmCube: number) => mmCube * 1e-9;

// time step in seconds
// widht and length in meters
// drop volume in mm
const getNumDrops = ({
    timeStep,
    areaWidth,
    areaLength,
    rainfallRate,
    dropVolume,
}: {
    timeStep: number;
    areaWidth: number;
    areaLength: number;
    rainfallRate: number;
    dropVolume: number;
}) => {
    const rainfallRateMeters = rainfallRate / 10 / 100;
    const hourlyVolume = rainfallRateMeters * areaWidth * areaLength;
    const volumePerSecond = hourlyVolume / 60 / 60;

    const timeStepVolume = timeStep * volumePerSecond;

    const nDrops = Math.round(timeStepVolume / cubeMmtoCubeM(dropVolume));
    return nDrops;
};

type Vec2D = { x: number; y: number };
type Vec3D = { x: number; y: number; z: number };

// width is x
// length is y
const getDropLocations = (
    nDrops: number,
    areaWidth: number,
    areaLength: number
): Vec2D[] => {
    return new Array(nDrops).fill(0).map(() => ({
        x: Math.random() * areaWidth,
        y: Math.random() * areaLength,
    }));
};

const dropsTo3D = (drops: Vec2D[], initialHeight: number): Vec3D[] =>
    drops.map((x) => ({ ...x, z: initialHeight }));

const distance3D = (a: Vec3D, b: Vec3D): number =>
    Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);

type SimulateOptions = {
    drops: Vec3D[];
    personLocation: Vec3D;
    personRadius: number;
    timeStep: number;
    speed: number; // direction is always to the oposite corner
    areaWidth: number;
    areaLength: number;
    rainfallRate: number;
    dropVolume: number;
    initialHeight: number;
    rainfallSpeed: number;
};

// maybe i'm taking the fp a little too far
// should a simulator be recursive like this? prob not.
// is it more fun? hell yeah!
// returns volume of rain to hit the guy
const simulate = (options: SimulateOptions): number => {
    const {
        drops,
        personLocation,
        personRadius,
        timeStep,
        speed,
        areaLength,
        areaWidth,
        rainfallRate,
        dropVolume,
        initialHeight,
        rainfallSpeed,
    } = options;

    const { intersectingCount, remaining } = drops.reduce<{
        intersectingCount: number;
        remaining: Vec3D[];
    }>(
        ({ intersectingCount, remaining }, d) => {
            if (distance3D(personLocation, d) <= personRadius) {
                return { intersectingCount: intersectingCount + 1, remaining };
            } else {
                return { intersectingCount, remaining: [...remaining, d] };
            }
        },
        { intersectingCount: 0, remaining: [] }
    );

    if (personLocation.x > areaWidth && personLocation.y > areaLength)
        return intersectingCount;

    const additionalDrops = dropsTo3D(
        getDropLocations(
            getNumDrops({
                timeStep,
                areaLength,
                areaWidth,
                rainfallRate,
                dropVolume,
            }),
            areaWidth,
            areaLength
        ),
        initialHeight
    );

    const diagonalMagnitude = Math.sqrt(areaLength ** 2 + areaWidth ** 2);
    const directionUnit: Vec2D = {
        x: areaWidth / diagonalMagnitude,
        y: areaLength / diagonalMagnitude,
    };

    const updatedPosition = {
        ...personLocation,
        x: personLocation.x + directionUnit.x * speed * timeStep,
        y: personLocation.y + directionUnit.y * speed * timeStep,
    };

    const nextDrops = [...remaining, ...additionalDrops]
        .map((d) => ({
            ...d,
            z: d.z - rainfallSpeed,
        }))
        .filter((d) => d.z > 0);
    // console.log(nextDrops.length);

    return (
        simulate({
            ...options,
            drops: nextDrops,
            personLocation: updatedPosition,
        }) + intersectingCount
    );
};

for (let i = 1; i <= 10; i++) {
    let avg = 0;

    for (let k = 0; k < 5; k++) {
        const volume = simulate({
            areaLength: 10,
            areaWidth: 10,
            drops: [],
            dropVolume,
            initialHeight: 10,
            personLocation: { x: 0, y: 0, z: 1 },
            personRadius: 1,
            rainfallRate,
            rainfallSpeed: 9,
            speed: i,
            timeStep: 0.01,
        });

        avg += volume / 5;
    }

    console.log(`speed: ${i}, volume: ${avg}`);
}
