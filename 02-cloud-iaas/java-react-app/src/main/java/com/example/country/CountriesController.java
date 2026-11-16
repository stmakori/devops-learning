package com.example.country;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/countries")
class CountriesController {

    private static final Logger log = LoggerFactory.getLogger(CountriesController.class);

    private static final List<String> COUNTRIES = List.of(
            "Albania", "Andorra", "Armenia", "Austria", "Azerbaijan", "Belarus", "Belgium",
            "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czechia", "Denmark",
            "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland",
            "Ireland", "Italy", "Kazakhstan", "Kosovo", "Latvia", "Liechtenstein", "Lithuania",
            "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands",
            "North Macedonia", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino",
            "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey",
            "Ukraine", "United Kingdom", "Vatican City");

    @GetMapping
    CountriesResponse getCountries() {
        log.info("GET /api/countries");
        return new CountriesResponse(COUNTRIES);
    }
}
