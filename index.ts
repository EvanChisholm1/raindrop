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
};

// maybe i'm taking the fp a little too far
// should a simulator be recursive like this? prob not.
// is it more fun? hell yeah!
// returns volume of rain to hit the guy
const simulate = ({
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
}: SimulateOptions): number => {
    // const validDrops = drops.filter(d)
};

console.log(
    getDropLocations(
        getNumDrops({
            timeStep: 0.1,
            areaLength: 10,
            areaWidth: 10,
            rainfallRate: 5,
            dropVolume,
        }),
        10,
        10
    )
);
