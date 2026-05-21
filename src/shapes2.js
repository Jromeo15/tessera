export const SHAPES = [
    // 🟦 CUADRADO 1 (3x3 sólido)
    {
      shape: [
        [0,0,0,1],
        [0,0,4,1],
        [0,1,1,0],
        [4,1,0,0],

      ],
      mode: "triangle",
    },
  
    // 🟦 CUADRADO 2 (2x2 sólido)
    {
      shape: [
        [1],
        [1],
      ],
      mode: "square",
    },
  
    // 🟦 CUADRADO 3 (rectangular 2x3 sólido)
    {
      shape: [
        [0,0,1,3],
        [0,1,1,1],
        [1,1,1,5],
      ],
      mode: "triangle",
    },
  
    // 🔺 TRIÁNGULO (equilátero aproximado con tus códigos)
    {
      shape: [
        [1,1],
        [1,0],
      ],
      mode: "square",
    },

    {
        shape: [
          [1,1,1,1,1,1,1,1,1,1],
          [1,1,0,0,0,0,0,0,0,1],
          [0,1,1,0,0,0,0,0,0,0],
          [0,0,1,0,0,0,0,0,0,0],
        ],
        mode: "square",
      },
      {
        shape: [
          [0,0,0,1],
          [0,1,1,1],
          [0,0,1,1],
          [0,1,1,1],
          [0,1,0,0],
          [1,1,1,1],
          [0,1,1,1],
          [0,1,1,0],
        ],
        mode: "square",
      },
    {
    shape: [
        [0,1,1,1],
        [1,1,1,0],
        [6,1,5,0],
        ],
        mode: "triangle",
    },
    {
        shape: [
            [1,1,1,1],
            [0,1,1,1],
            [0,0,1,1],
            [0,0,1,1],
            [0,0,0,1]
        ],
        mode: "square",
        },
        {
            shape: [
              [0,0,1,1,0,0,0],
              [0,1,1,1,1,1,0],
              [1,1,0,1,1,1,1],
              [0,0,0,0,0,1,0],
            ],
            mode: "square",
          },

  ];