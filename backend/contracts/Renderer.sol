//SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

import "./Trigonometry.sol";
import "./Utilities.sol";

library Renderer {
  uint256 constant SIZE = 500;

  function getOrbitSVG(
    uint256 planetRadius,
    uint256 orbitRadius,
    uint256[3] memory color,
    uint256 initialAngleDegrees,
    uint256 duration
  ) public pure returns (string memory) {
    uint256 halfCanvasWidth = SIZE / 2;

    // Calculate the initial position of the planet
    int256 x = int256(orbitRadius);
    int256 y = 0;

    int256 newX = x;
    int256 newY = y;

    newX =
      x *
      Trigonometry.cos(initialAngleDegrees * (Trigonometry.PI / 180)) -
      y *
      Trigonometry.sin(initialAngleDegrees * (Trigonometry.PI / 180));
    newY =
      x *
      Trigonometry.sin(initialAngleDegrees * (Trigonometry.PI / 180)) +
      y *
      Trigonometry.cos(initialAngleDegrees * (Trigonometry.PI / 180));

    // Generate the SVG string
    string memory renderedSVG = string.concat(
      '<circle cx="',
      utils.uint2str(halfCanvasWidth),
      '" cy="',
      utils.uint2str(halfCanvasWidth),
      '" r="',
      utils.uint2str(orbitRadius),
      '" fill="none" stroke="rgba(',
      utils.uint2str(color[0]),
      ",",
      utils.uint2str(color[1]),
      ",",
      utils.uint2str(color[2]),
      ',0.5)"></circle>',
      '<circle cx="',
      utils.uint2str(uint256(int256(halfCanvasWidth) + newX / 1e18)),
      '" cy="'
    );

    renderedSVG = string.concat(
      renderedSVG,
      utils.uint2str(uint256(int256(halfCanvasWidth) - newY / 1e18)),
      '" r="',
      utils.uint2str(planetRadius),
      '" fill="rgb(',
      utils.uint2str(color[0]),
      ",",
      utils.uint2str(color[1]),
      ",",
      utils.uint2str(color[2]),
      ')">',
      '<animateTransform attributeName="transform" type="rotate" from="0 ',
      utils.uint2str(halfCanvasWidth),
      " ",
      utils.uint2str(halfCanvasWidth),
      '" to="360 ',
      utils.uint2str(halfCanvasWidth),
      " ",
      utils.uint2str(halfCanvasWidth),
      '" dur="'
    );
    renderedSVG = string.concat(
      renderedSVG,
      utils.uint2str(duration),
      's" repeatCount="indefinite">',
      "</animateTransform>",
      "</circle>"
    );

    return renderedSVG;
  }

  function min(uint256 a, uint256 b) internal pure returns (uint256) {
    return a < b ? a : b;
  }

  function getSVG(uint256 _tokenId) public pure returns (string memory) {
    uint256 numPlanets = utils.randomRange(_tokenId, "numPlanets", 1, 8);
    uint256 radiusInterval = SIZE / 2 / (numPlanets + 3);
    uint256 planetRadiusUpperBound = min(radiusInterval / 2, SIZE / 4);
    uint256 planetRadiusLowerBound = radiusInterval / 4;

    uint256 sunRadius = utils.randomRange(_tokenId, "sunRadius", radiusInterval, radiusInterval + 10);

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
      uint256 planetRadius = utils.randomRange(
        _tokenId,
        string.concat("planetRadius", utils.uint2str(i)),
        planetRadiusLowerBound,
        planetRadiusUpperBound
      );
      uint256 orbitRadius = radiusInterval * (i + 3);
      uint256 duration = utils.randomRange(_tokenId, string.concat("duration", utils.uint2str(i)), 5, 15);

      uint256[3] memory colorTuple;
      colorTuple[0] = utils.randomRange(_tokenId, string.concat("colorR", utils.uint2str(i)), 100, 255);
      colorTuple[1] = utils.randomRange(_tokenId, string.concat("colorG", utils.uint2str(i)), 100, 255);
      colorTuple[2] = utils.randomRange(_tokenId, string.concat("colorB", utils.uint2str(i)), 100, 255);

      uint256 initialAngleDegrees = utils.randomRange(
        _tokenId,
        string.concat("initialAngle", utils.uint2str(i)),
        0,
        360
      );

      string memory planet = getOrbitSVG(planetRadius, orbitRadius, colorTuple, initialAngleDegrees, duration);
      renderSvg = string.concat(renderSvg, planet);
    }

    renderSvg = string.concat(renderSvg, "</svg>");

    return renderSvg;
  }

  function render(uint256 _tokenId) public pure returns (string memory) {
    return getSVG(_tokenId);
  }
}
