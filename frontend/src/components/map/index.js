import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
import { useState, useEffect } from 'react';
import _ from 'lodash';

export default function Map() {

    function getWindowDimensions() {
        const { innerWidth: width, innerHeight: height } = window;
        return {
            width,
            height
        };
    }

    function useWindowDimensions() {
        const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

        useEffect(() => {
            function handleResize() {
                setWindowDimensions(getWindowDimensions());
            }

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }, []);

        return windowDimensions;
    }



    const { height, width } = useWindowDimensions();

    const [hexes, setHexes] = useState([[0, 0, 0]]);

    function getAdjacentUnsetHexes(hexes) {
        var adjacentHexes = []
        hexes.map(hex => {
            adjacentHexes = adjacentHexes.concat([
                [hex[0], hex[1] + 1, hex[2] - 1],
                [hex[0], hex[1] - 1, hex[2] + 1],
                [hex[0] + 1, hex[1], hex[2] - 1],
                [hex[0] - 1, hex[1], hex[2] + 1],
                [hex[0] + 1, hex[1] - 1, hex[2]],
                [hex[0] - 1, hex[1] + 1, hex[2]]
            ]);
        })
        console.log(hexes);
        console.log(adjacentHexes);
        adjacentHexes = _.reject(adjacentHexes, function (e1) {
            return _.find(hexes, function (e2) { return e1[0] == e2[0] && e1[1] == e2[1] })
        });
        return adjacentHexes.filter((hex) => !hexes.includes(hex))
    }

    const [addableHexes, setAddableHexes] = useState([]);

    function addHex(hex) {
        const concatHexList = hexes.concat([hex]);
        setHexes(concatHexList);
    }

    useEffect(() => {
        setAddableHexes(getAdjacentUnsetHexes(hexes));
    }, [hexes]);

    return (
        <HexGrid width={width} height={height} viewBox='-50 -50 100 100'>
            {/* Grid with manually inserted hexagons */}
            <Layout size={{ x: 7.14, y: 7.14 }} flat={true} spacing={1.1} origin={{ x: 0, y: 0 }}>
                {
                    hexes && hexes.map((hex, index) =>
                        <Hexagon q={hex[0]} r={hex[1]} s={hex[2]} key={index} />
                    )
                }
                {
                    addableHexes && addableHexes.map(hex =>
                        <Hexagon className="adjacent" onClick={() => addHex(hex)} q={hex[0]} r={hex[1]} s={hex[2]} />
                    )
                }
            </Layout>
        </HexGrid>
    )
}