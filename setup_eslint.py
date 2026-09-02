import os
import json

client_eslintrc = {
  "env": {
    "browser": True,
    "es2021": True
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": True
    },
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}

server_eslintrc = {
  "env": {
    "node": True,
    "es2021": True
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-non-null-assertion": "off"
  }
}

with open('client/.eslintrc.json', 'w', encoding='utf-8') as f:
    json.dump(client_eslintrc, f, indent=2)

with open('server/.eslintrc.json', 'w', encoding='utf-8') as f:
    json.dump(server_eslintrc, f, indent=2)
