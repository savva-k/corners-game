package com.playcorners.controller;

import com.playcorners.util.ValidationConstants;
import com.playcorners.model.tiles.TileMap;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Pattern;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;

@RestController()
@RequestMapping("/tile-maps")
public class TileMapController {

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
            InputStream in;
            try {
                in = getClass().getClassLoader().getResourceAsStream(id + ".png");
                if (in == null) {
                    in = Files.newInputStream(Paths.get("src/main/resources/" + id + ".png"));
                }
                return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(new InputStreamResource(in));
            } catch (IOException e) {
                return ResponseEntity.notFound().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
}
