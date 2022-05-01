"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinishReason = void 0;
var FinishReason;
(function (FinishReason) {
    FinishReason[FinishReason["WhiteWon"] = 0] = "WhiteWon";
    FinishReason[FinishReason["BlackWon"] = 1] = "BlackWon";
    FinishReason[FinishReason["DrawMoreThan80Moves"] = 2] = "DrawMoreThan80Moves";
    FinishReason[FinishReason["DrawWhiteCantMove"] = 3] = "DrawWhiteCantMove";
    FinishReason[FinishReason["DrawBlackCantMove"] = 4] = "DrawBlackCantMove";
    FinishReason[FinishReason["DrawBothHome"] = 5] = "DrawBothHome";
})(FinishReason = exports.FinishReason || (exports.FinishReason = {}));
