//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./Trigonometry.sol";
import "./Utilities.sol";

library Renderer {
  uint256 constant SIZE = 500;

  struct Planet {
    uint256 planetRadius;
    uint256 ringsOffset;
    uint256 orbitRadius;
    uint256 ringsRadius;
    uint256[3] color;
    uint256 initialAngleDegrees;
    uint256 duration;
  }

  function getOrbitSVG(Planet memory planet) public pure returns (string memory) {
    uint256 halfCanvasWidth = SIZE / 2;

    // Calculate the initial position of the planet
    int256 x = int256(planet.orbitRadius);
    int256 y = 0;

    int256 newX = x;
    int256 newY = y;

    newX =
      x *
      Trigonometry.cos(planet.initialAngleDegrees * (Trigonometry.PI / 180)) -
      y *
      Trigonometry.sin(planet.initialAngleDegrees * (Trigonometry.PI / 180));
    newY =
      x *
      Trigonometry.sin(planet.initialAngleDegrees * (Trigonometry.PI / 180)) +
      y *
      Trigonometry.cos(planet.initialAngleDegrees * (Trigonometry.PI / 180));

    // JavaScript implementation
    //   `<g>
    //   <circle
    //     cx="${halfCanvasWidth + newX}"
    //     cy="${halfCanvasWidth - newY}"
    //     r="${planetRadius}"
    //     fill="rgb(${color[0]},${color[1]},${color[2]})"
    //   />
    //   <circle
    //     cx="${halfCanvasWidth + newX}"
    //     cy="${halfCanvasWidth - newY}"
    //     r="${ringsRadius}"
    //     fill="none"
    //     stroke="rgb(${color[0]},${color[1]},${color[2]})"
    //     stroke-width="1"
    //   />
    //   <animateTransform
    //       attributeName="transform"
    //       type="rotate"
    //       from="0 ${halfCanvasWidth} ${halfCanvasWidth}"
    //       to="360 ${halfCanvasWidth} ${halfCanvasWidth}"
    //       dur="${duration}"
    //       repeatCount="indefinite"/>
    // </g>
    // <circle cx="${halfCanvasWidth}" cy="${halfCanvasWidth}" r="${orbitRadius}" fill="none" stroke="rgba(${color[0]},${
    //   color[1]
    // },${color[2]},0.5)"/>`
    string memory colorTuple = string.concat(
      utils.uint2str(planet.color[0]),
      ",",
      utils.uint2str(planet.color[1]),
      ",",
      utils.uint2str(planet.color[2])
    );

    uint256 ringsRadius = planet.planetRadius + planet.ringsOffset;

    // Generate the SVG string
    string memory renderedSVG = string.concat(
      '<g><circle cx="',
      utils.uint2str(uint256(int256(halfCanvasWidth) + newX / 1e18)),
      '" cy="',
      utils.uint2str(uint256(int256(halfCanvasWidth) - newY / 1e18)),
      '" r="',
      utils.uint2str(planet.planetRadius),
      '" fill="rgb(',
      colorTuple,
      ')"/>',
      '<circle cx="',
      utils.uint2str(uint256(int256(halfCanvasWidth) + newX / 1e18)),
      '" cy="',
      utils.uint2str(uint256(int256(halfCanvasWidth) - newY / 1e18)),
      '" r="',
      utils.uint2str(ringsRadius),
      '" fill="none" stroke-width="1" stroke="rgb(',
      colorTuple,
      ')"/>',
      '<animateTransform attributeName="transform" type="rotate" from="0 '
    );

    renderedSVG = string.concat(
      renderedSVG,
      utils.uint2str(halfCanvasWidth),
      " ",
      utils.uint2str(halfCanvasWidth),
      '" to="360 ',
      utils.uint2str(halfCanvasWidth),
      " ",
      utils.uint2str(halfCanvasWidth),
      '" dur="',
      utils.uint2str(planet.duration),
      's" repeatCount="indefinite"/>',
      "</g>",
      '<circle cx="',
      utils.uint2str(halfCanvasWidth),
      '" cy="',
      utils.uint2str(halfCanvasWidth),
      '" r="'
    );

    renderedSVG = string.concat(
      renderedSVG,
      utils.uint2str(planet.orbitRadius),
      '" fill="none" stroke="rgba(',
      colorTuple,
      ',0.5)"/>'
    );

    return renderedSVG;
  }

  function numPlanetsForTokenId(uint256 _tokenId) public pure returns (uint256) {
    return utils.randomRange(_tokenId, "numPlanets", 1, 8);
  }

  function numRingedPlanetsForTokenId(uint256 _tokenId) public pure returns (uint256) {
    uint256 numRingedPlanets;
    for (uint256 i = 0; i < numPlanetsForTokenId(_tokenId); i++) {
      if (utils.randomRange(_tokenId, string.concat("ringedPlanet", utils.uint2str(i)), 0, 10) == 5) {
        numRingedPlanets++;
      }
    }
    return numRingedPlanets;
  }

  function getSVG(uint256 _tokenId) public pure returns (string memory) {
    uint256 numPlanets = numPlanetsForTokenId(_tokenId);
    uint256 radiusInterval = SIZE / 2 / (numPlanets + 3);
    uint256 planetRadiusUpperBound = utils.min(radiusInterval / 2, SIZE / 4);
    uint256 planetRadiusLowerBound = radiusInterval / 4;

    uint256 sunRadius = utils.randomRange(_tokenId, "sunRadius", radiusInterval, radiusInterval * 2 - 10);

    string memory renderSvg = string.concat(
      '<svg width="',
      utils.uint2str(SIZE),
      '" height="',
      utils.uint2str(SIZE),
      '" viewBox="0 0 ',
      utils.uint2str(SIZE),
      " ",
      utils.uint2str(SIZE),
      '" xmlns="http://www.w3.org/2000/svg">',
      '<rect width="',
      utils.uint2str(SIZE),
      '" height="',
      utils.uint2str(SIZE),
      '" fill="#0D1F2F"></rect>',
      '<circle cx="',
      utils.uint2str(SIZE / 2),
      '" cy="',
      utils.uint2str(SIZE / 2),
      '" r="',
      utils.uint2str(sunRadius),
      '" fill="#FFDA17"></circle>'
    );

    for (uint256 i = 0; i < numPlanets; i++) {
      // const ringsOffset = Math.round(Math.random()) * 1
      // const radius =
      //   Math.random() * (planetRadiusUpperBound - planetRadiusLowerBound - ringsOffset) + planetRadiusLowerBound
      // const ringsRadius = ringsOffset + radius

      Planet memory planet;

      if (utils.randomRange(_tokenId, string.concat("ringsOffset", utils.uint2str(i)), 0, 10) == 5) {
        planet.ringsOffset = 4;
      }

      planet.planetRadius = utils.randomRange(
        _tokenId,
        string.concat("planetRadius", utils.uint2str(i)),
        planetRadiusLowerBound,
        planetRadiusUpperBound - planet.ringsOffset
      );

      planet.orbitRadius = radiusInterval * (i + 3);
      planet.duration = utils.randomRange(_tokenId, string.concat("duration", utils.uint2str(i)), 5, 15);

      planet.color[0] = utils.randomRange(_tokenId, string.concat("colorR", utils.uint2str(i)), 100, 255);
      planet.color[1] = utils.randomRange(_tokenId, string.concat("colorG", utils.uint2str(i)), 100, 255);
      planet.color[2] = utils.randomRange(_tokenId, string.concat("colorB", utils.uint2str(i)), 100, 255);

      planet.initialAngleDegrees = utils.randomRange(
        _tokenId,
        string.concat("initialAngle", utils.uint2str(i)),
        0,
        360
      );

      planet.ringsRadius = utils.randomRange(
        _tokenId,
        string.concat("ringsRadius", utils.uint2str(i)),
        0,
        planet.planetRadius / 2
      );

      string memory planetSVG = getOrbitSVG(planet);
      renderSvg = string.concat(renderSvg, planetSVG);
    }

    renderSvg = string.concat(renderSvg, "</svg>");

    return renderSvg;
  }

  function render(uint256 _tokenId) public pure returns (string memory) {
    return getSVG(_tokenId);
  }
}
