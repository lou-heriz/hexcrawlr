import { HexGrid, Layout, Hexagon, Text, Pattern, Path, Hex } from 'react-hexgrid';
import { useState, useEffect } from 'react';
import _ from 'lodash';
import { motion } from "framer-motion";
import addIcon from "../../assets/AddIcon.svg";
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

    const [hexes, setHexes] = useState([{ q: 0, r: 0, s: 0 }]);

    function getAdjacentUnsetHexes(hexes) {
        var adjacentHexes = []
        hexes.map(hex => {
            adjacentHexes = adjacentHexes.concat([
                { q: hex.q, r: hex.r + 1, s: hex.s - 1 },
                { q: hex.q, r: hex.r - 1, s: hex.s + 1 },
                { q: hex.q - 1, r: hex.r + 1, s: hex.s },
                { q: hex.q - 1, r: hex.r, s: hex.s + 1 },
                { q: hex.q + 1, r: hex.r - 1, s: hex.s },
                { q: hex.q + 1, r: hex.r, s: hex.s - 1 },
            ]);
        })
        adjacentHexes = _.uniqWith(adjacentHexes, _.isEqual)
        adjacentHexes = _.reject(adjacentHexes, function (e1) {
            return _.find(hexes, function (e2) { return e1.q == e2.q && e1.r == e2.r && e1.s == e2.s })
        });
        return adjacentHexes
    }

    const [addableHexes, setAddableHexes] = useState(getAdjacentUnsetHexes(hexes));

    function getAdjacentToHex(hex) {
        var adjacentHexes = [
            { q: hex.q, r: hex.r + 1, s: hex.s - 1 },
            { q: hex.q, r: hex.r - 1, s: hex.s + 1 },
            { q: hex.q - 1, r: hex.r + 1, s: hex.s },
            { q: hex.q - 1, r: hex.r, s: hex.s + 1 },
            { q: hex.q + 1, r: hex.r - 1, s: hex.s },
            { q: hex.q + 1, r: hex.r, s: hex.s - 1 },
        ];

        adjacentHexes = _.reject(adjacentHexes, function (e1) {
            return _.find(hexes.concat(addableHexes), function (e2) { return e1.q == e2.q && e1.r == e2.r && e1.s == e2.s })
        });
        return adjacentHexes
    }

    function addHex(hex) {
        const concatHexList = hexes.concat([hex]);
        setHexes(concatHexList);
        setAddableHexes(_.reject(addableHexes.concat(getAdjacentToHex(hex)), function (e) {
            return e.q == hex.q && e.r == hex.r
        }));
    }

    // useEffect(() => {
    //     setAddableHexes(getAdjacentToHex(hexes));
    // }, [hexes]);

    const container = {
        hidden: { opacity: 1 },
        visible: {
            opacity: 1,
        }
    };

    const item = {
        hidden: { y: 0, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                delay: 0,
                duration: 2,
            },
        }
    };

    const addableItem = {
        hidden: { y: 0, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                delay: 0.5,
                duration: 2,
            },
        }
    };

    return (
        <HexGrid width={width} height={height} viewBox='-50 -50 100 100'>
            {/* Grid with manually inserted hexagons */}
            <Layout size={{ x: 10, y: 10 }} flat={true} spacing={1.1} origin={{ x: 0, y: 0 }}>
                <img src="./AddIcon.svg" />
                <motion.g
                    className="container"
                    variants={container}
                    initial="hidden"
                    animate="visible">

                    {
                        hexes && hexes.map(hex =>
                            <motion.g key={"q" + hex.q + "r" + hex.r + "s" + hex.s} variants={item} >
                                <Hexagon id={"q" + hex.q + "r" + hex.r + "s" + hex.s} q={hex.q} r={hex.r} s={hex.s} key={"q" + hex.q + "r" + hex.r + "s" + hex.s} />
                            </motion.g>
                        )
                    }
                    {
                        addableHexes && addableHexes.map(hex =>
                            <motion.g key={"addable-q" + hex.q + "r" + hex.r + "s" + hex.s} variants={addableItem} >
                                <Hexagon
                                    id={"addable-q" + hex.q + "r" + hex.r + "s" + hex.s}
                                    className="adjacent"
                                    key={"addable-q" + hex.q + "r" + hex.r + "s" + hex.s}
                                    onClick={() => addHex(hex)} q={hex.q} r={hex.r} s={hex.s}
                                    fill="pat-1">
                                </Hexagon>
                            </motion.g>
                        )
                    }
                </motion.g>
            </Layout>
            <Pattern id="pat-1" link={addIcon} size={{ x: 10, y: 9 }} />
        </HexGrid >
    )
}