package com.example.country;

import java.util.List;

/** JSON body returned by GET /api/countries: { "countries": [ ... ] } */
public record CountriesResponse(List<String> countries) {
}
