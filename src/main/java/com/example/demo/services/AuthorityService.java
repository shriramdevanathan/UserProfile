package com.example.demo.services;

import java.util.List;
import com.example.demo.model.Authority;

public interface AuthorityService {
  List<Authority> findById(Long id);

  List<Authority> findByname(String name);

}