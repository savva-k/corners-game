package com.playcorners.controller;

import com.playcorners.util.ValidationConstants;
import com.playcorners.model.tiles.TileMap;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.Map;

@RestController()
@RequestMapping("/tile-maps")
public class TileMapController {

    @Value("${scheme}")
    private String scheme;

    @GetMapping("/{tileMapName}")
    private ResponseEntity<TileMap> getTileMapByName(
            @Valid
            @Pattern(regexp = ValidationConstants.MAP_NAME, message = ValidationConstants.INVALID_MAP_NAME)
            @PathVariable String tileMapName
    ) {
        if ("base-cell".equals(tileMapName)) {
            var tileMap = new TileMap(
                    tileMapName,
                    ServletUriComponentsBuilder
                            .fromCurrentContextPath()
                            .scheme(scheme)
                            .path("/tile-maps/image/{id}")
                            .buildAndExpand(tileMapName)
                            .toString(),
                    48, 48, Map.of()
            );
            return ResponseEntity.ok(tileMap);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/image/{id}")
    private ResponseEntity<InputStreamResource> getTileMapImage(
            @Valid
            @Pattern(regexp = ValidationConstants.IMAGE_NAME, message = ValidationConstants.INVALID_IMAGE_NAME)
            @PathVariable String id
    ) {
        if ("base-cell".equals(id)) {
            ClassPathResource in = new ClassPathResource(id + ".png");
            if (!in.exists()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(new InputStreamResource(in));
        }
        return ResponseEntity.notFound().build();
    }
}
