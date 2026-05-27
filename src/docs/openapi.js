const openApiSpec = {
  openapi: "3.0.0",
  info: {
    title: "Evercodelab API",
    version: "1.0.0",
    description: "API for Node.js backend task."
  },
  servers: [
    {
      url: "http://localhost:3000"
    }
  ],
  paths: {
    "/status": {
      get: {
        summary: "Get app status",
        security: [],
        responses: {
          200: {
            description: "App is working.",
            content: {
              "text/plain": {
                schema: {
                  type: "string",
                  example: "ok"
                }
              }
            }
          }
        }
      }
    },
    "/openapi.json": {
      get: {
        summary: "Get OpenAPI file",
        security: [],
        responses: {
          200: {
            description: "OpenAPI file.",
            content: {
              "application/json": {
                schema: {
                  type: "object"
                }
              }
            }
          }
        }
      }
    },
    "/api/currencies": {
      get: {
        summary: "Get currency list",
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          200: {
            description: "Currency list.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/Currency"
                  }
                }
              }
            }
          },
          403: {
            $ref: "#/components/responses/Forbidden"
          }
        }
      },
      post: {
        summary: "Create currency",
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Currency"
              },
              example: {
                name: "Bitcoin",
                ticker: "BTC"
              }
            }
          }
        },
        responses: {
          201: {
            description: "Currency created.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Currency"
                },
                example: {
                  name: "Bitcoin",
                  ticker: "BTC"
                }
              }
            }
          },
          400: {
            $ref: "#/components/responses/BadRequest"
          },
          403: {
            $ref: "#/components/responses/Forbidden"
          },
          409: {
            $ref: "#/components/responses/Conflict"
          }
        }
      }
    },
    "/api/currencies/{ticker}": {
      get: {
        summary: "Get currency by ticker",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "ticker",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "BTC"
            }
          }
        ],
        responses: {
          200: {
            description: "Currency found.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Currency"
                },
                example: {
                  name: "Bitcoin",
                  ticker: "BTC"
                }
              }
            }
          },
          403: {
            $ref: "#/components/responses/Forbidden"
          },
          404: {
            $ref: "#/components/responses/NotFound"
          }
        }
      },
      put: {
        summary: "Update currency",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "ticker",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "BTC"
            }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/Currency"
              },
              example: {
                name: "Bitcoin new",
                ticker: "BTC"
              }
            }
          }
        },
        responses: {
          200: {
            description: "Currency updated.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/Currency"
                },
                example: {
                  name: "Bitcoin new",
                  ticker: "BTC"
                }
              }
            }
          },
          400: {
            $ref: "#/components/responses/BadRequest"
          },
          403: {
            $ref: "#/components/responses/Forbidden"
          },
          404: {
            $ref: "#/components/responses/NotFound"
          }
        }
      },
      delete: {
        summary: "Delete currency",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "ticker",
            in: "path",
            required: true,
            schema: {
              type: "string",
              example: "BTC"
            }
          }
        ],
        responses: {
          204: {
            description: "Currency deleted."
          },
          403: {
            $ref: "#/components/responses/Forbidden"
          },
          404: {
            $ref: "#/components/responses/NotFound"
          }
        }
      }
    },
    "/price": {
      get: {
        summary: "Get prices by currency",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "currency",
            in: "query",
            required: true,
            schema: {
              type: "string",
              example: "BTC"
            }
          }
        ],
        responses: {
          200: {
            description: "Price list.",
            content: {
              "application/json": {
                schema: {
                  $ref: "#/components/schemas/PriceResponse"
                },
                example: {
                  currency: "BTC",
                  prices: [
                    {
                      symbol: "BTCUSDT",
                      price: "68000.00000000"
                    },
                    {
                      symbol: "ETHBTC",
                      price: "0.05200000"
                    }
                  ]
                }
              }
            }
          },
          400: {
            $ref: "#/components/responses/BadRequest"
          },
          403: {
            $ref: "#/components/responses/Forbidden"
          },
          404: {
            $ref: "#/components/responses/NotFound"
          },
          502: {
            $ref: "#/components/responses/ExternalApiError"
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer"
      }
    },
    schemas: {
      Currency: {
        type: "object",
        required: ["name", "ticker"],
        properties: {
          name: {
            type: "string",
            example: "Bitcoin"
          },
          ticker: {
            type: "string",
            example: "BTC"
          }
        }
      },
      Price: {
        type: "object",
        required: ["symbol", "price"],
        properties: {
          symbol: {
            type: "string",
            example: "BTCUSDT"
          },
          price: {
            type: "string",
            example: "68000.00000000"
          }
        }
      },
      PriceResponse: {
        type: "object",
        required: ["currency", "prices"],
        properties: {
          currency: {
            type: "string",
            example: "BTC"
          },
          prices: {
            type: "array",
            items: {
              $ref: "#/components/schemas/Price"
            }
          }
        }
      },
      ErrorResponse: {
        type: "object",
        required: ["error"],
        properties: {
          error: {
            type: "string",
            example: "Currency not found"
          },
          requestId: {
            type: "string",
            example: "requestId"
          }
        }
      },
      ValidationErrorResponse: {
        type: "object",
        required: ["error", "details"],
        properties: {
          error: {
            type: "string",
            example: "Invalid currency data"
          },
          requestId: {
            type: "string",
            example: "requestId"
          },
          details: {
            type: "array",
            items: {
              type: "string"
            },
            example: ["Name is required", "Ticker is required"]
          }
        }
      }
    },
    responses: {
      BadRequest: {
        description: "Bad request.",
        content: {
          "application/json": {
            schema: {
              oneOf: [
                {
                  $ref: "#/components/schemas/ErrorResponse"
                },
                {
                  $ref: "#/components/schemas/ValidationErrorResponse"
                }
              ]
            },
            examples: {
              invalidCurrencyData: {
                value: {
                  error: "Invalid currency data",
                  requestId: "requestId",
                  details: ["Name is required", "Ticker is required"]
                }
              },
              missingCurrencyQuery: {
                value: {
                  error: "Currency is required",
                  requestId: "requestId",
                  details: ["Currency is required"]
                }
              }
            }
          }
        }
      },
      Forbidden: {
        description: "Access denied.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse"
            },
            example: {
              error: "Forbidden",
              requestId: "requestId"
            }
          }
        }
      },
      NotFound: {
        description: "Data not found.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse"
            },
            example: {
              error: "Currency not found",
              requestId: "requestId"
            }
          }
        }
      },
      Conflict: {
        description: "Data already exists.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse"
            },
            example: {
              error: "Currency already exists",
              requestId: "requestId"
            }
          }
        }
      },
      ExternalApiError: {
        description: "External API error.",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/ErrorResponse"
            },
            example: {
              error: "Binance is not available",
              requestId: "requestId"
            }
          }
        }
      }
    }
  }
};

module.exports = openApiSpec;