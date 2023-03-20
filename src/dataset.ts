import {MarkupEntityJSON} from '@tada-team/tdproto-ts'

type Spec = {
  name: string,
  s: string,
  mu: MarkupEntityJSON[],
  expected: string
}

const specs: Spec[] = [
  {
    name: 'noop',
    s: '123',
    mu: [],
    expected: '<span>123</span>'
  },
  {
    name: 'empty bold',
    s: '**',
    mu: [],
    expected: '<span>**</span>'
  },
  {
    name: 'one bold',
    s: '*1*',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 2,
        cllen: 1,
        typ: 'bold'
      }
    ],
    expected: '<b>1</b>'
  },
  {
    name: 'bold is inline only',
    s: '123 *45\n6* 789',
    mu: [],
    expected: '<span>123 *45\n6* 789</span>'
  },
  {
    name: 'bold ru',
    s: 'привет, *ромашки!*',
    mu: [
      {
        op: 8,
        oplen: 1,
        cl: 17,
        cllen: 1,
        typ: 'bold'
      }
    ],
    expected: '<span>привет, </span><b>ромашки!</b>'
  },
  {
    name: 'bold only',
    s: '*123*',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 4,
        cllen: 1,
        typ: 'bold'
      }
    ],
    expected: '<b>123</b>'
  },
  {
    name: 'bold and punctuation',
    s: '*123*!',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 4,
        cllen: 1,
        typ: 'bold'
      }
    ],
    expected: '<b>123</b><span>!</span>'
  },
  {
    name: 'not a bold',
    s: '*123\n456*',
    mu: [],
    expected: '<span>*123\n456*</span>'
  },
  {
    name: 'bold eof',
    s: '123 *456*',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 8,
        cllen: 1,
        typ: 'bold'
      }
    ],
    expected: '<span>123 </span><b>456</b>'
  },
  {
    name: 'bold eol',
    s: '123 *456*\n*789*',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 8,
        cllen: 1,
        typ: 'bold'
      },
      {
        op: 10,
        oplen: 1,
        cl: 14,
        cllen: 1,
        typ: 'bold'
      }
    ],
    expected: '<span>123 </span><b>456</b><span>\n</span><b>789</b>'
  },
  {
    name: 'double bold',
    s: '123 *456* 789 *10*',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 8,
        cllen: 1,
        typ: 'bold'
      },
      {
        op: 14,
        oplen: 1,
        cl: 17,
        cllen: 1,
        typ: 'bold'
      }
    ],
    expected: '<span>123 </span><b>456</b><span> 789 </span><b>10</b>'
  },
  {
    name: 'code only',
    s: '`123`',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 4,
        cllen: 1,
        typ: 'code'
      }
    ],
    expected: '<code>123</code>'
  },
  {
    name: 'no markup inside code',
    s: '`*123*`',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 6,
        cllen: 1,
        typ: 'code'
      }
    ],
    expected: '<code>*123*</code>'
  },
  {
    name: 'no markup inside code 2',
    s: '`123 ~456~ `',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 11,
        cllen: 1,
        typ: 'code'
      }
    ],
    expected: '<code>123 ~456~ </code>'
  },
  {
    name: 'no markup inside code 3',
    s: 'example: ` 123 ~456~ `',
    mu: [
      {
        op: 9,
        oplen: 1,
        cl: 21,
        cllen: 1,
        typ: 'code'
      }
    ],
    expected: '<span>example: </span><code> 123 ~456~ </code>'
  },
  {
    name: 'italic',
    s: '123 /456/ 789',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 8,
        cllen: 1,
        typ: 'italic'
      }
    ],
    expected: '<span>123 </span><i>456</i><span> 789</span>'
  },
  {
    name: 'not italic',
    s: '123 / 456/ 789',
    mu: [],
    expected: '<span>123 / 456/ 789</span>'
  },
  {
    name: 'not italic 2',
    s: '123 / 456 / 789',
    mu: [],
    expected: '<span>123 / 456 / 789</span>'
  },
  {
    name: 'not italic 3',
    s: '123/ 456 /789',
    mu: [],
    expected: '<span>123/ 456 /789</span>'
  },
  {
    name: 'not italic 4 with link',
    s: 'https://ya.ru/',
    mu: [
      {
        op: 0,
        cl: 14,
        typ: 'link',
        url: 'https://ya.ru/',
        repl: 'ya.ru'
      }
    ],
    expected: '<a href="https://ya.ru/">ya.ru</a>'
  },
  {
    name: 'bold italic',
    s: '*/123/*',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 6,
        cllen: 1,
        typ: 'bold',
        childs: [
          {
            op: 0,
            oplen: 1,
            cl: 4,
            cllen: 1,
            typ: 'italic'
          }
        ]
      }
    ],
    expected: '<b><i>123</i></b>'
  },
  {
    name: 'code block',
    s: '```code```',
    mu: [
      {
        op: 0,
        oplen: 3,
        cl: 7,
        cllen: 3,
        typ: 'codeblock'
      }
    ],
    expected: '<pre>code</pre>'
  },
  {
    name: 'code block multiline',
    s: '```code\nnl```',
    mu: [
      {
        op: 0,
        oplen: 3,
        cl: 10,
        cllen: 3,
        typ: 'codeblock'
      }
    ],
    expected: '<pre>code\nnl</pre>'
  },
  {
    name: 'code block with newlines',
    s: '```\ncode\nline\n```',
    mu: [
      {
        op: 0,
        oplen: 4,
        cl: 13,
        cllen: 4,
        typ: 'codeblock'
      }
    ],
    expected: '<pre>code\nline</pre>'
  },
  {
    name: 'code block with newlines with spaces',
    s: '``` \ncode\nline\n```',
    mu: [
      {
        op: 0,
        oplen: 5,
        cl: 14,
        cllen: 4,
        typ: 'codeblock'
      }
    ],
    expected: '<pre>code\nline</pre>'
  },
  {
    name: 'code incomplete',
    s: '```code\nnl``',
    mu: [],
    expected: '<span>```code\nnl``</span>'
  },
  {
    name: 'bold italic with spaces',
    s: '123 /4 *5* 6/ 789',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 12,
        cllen: 1,
        typ: 'italic',
        childs: [
          {
            op: 2,
            oplen: 1,
            cl: 4,
            cllen: 1,
            typ: 'bold'
          }
        ]
      }
    ],
    expected: '<span>123 </span><i><span>4 </span><b>5</b><span> 6</span></i><span> 789</span>'
  },
  {
    name: 'quote',
    s: '> 123\n456',
    mu: [
      {
        op: 0,
        oplen: 2,
        cl: 5,
        cllen: 1,
        typ: 'quote'
      }
    ],
    expected: '<blockquote>123</blockquote><span>456</span>'
  },
  {
    name: 'quote only',
    s: '> 123',
    mu: [
      {
        op: 0,
        oplen: 2,
        cl: 5,
        typ: 'quote'
      }
    ],
    expected: '<blockquote>123</blockquote>'
  },
  {
    name: 'bold in quote',
    s: '> 12 *3*\n456',
    mu: [
      {
        op: 0,
        oplen: 2,
        cl: 8,
        cllen: 1,
        typ: 'quote',
        childs: [
          {
            op: 3,
            oplen: 1,
            cl: 5,
            cllen: 1,
            typ: 'bold'
          }
        ]
      }
    ],
    expected: '<blockquote><span>12 </span><b>3</b></blockquote><span>456</span>'
  },
  {
    name: 'quote in quote',
    s: '> 3 > 4',
    mu: [
      {
        op: 0,
        oplen: 2,
        cl: 7,
        typ: 'quote',
        childs: [
          {
            op: 2,
            cl: 3,
            typ: 'unsafe'
          }
        ]
      }
    ],
    expected: '<blockquote><span>3 </span><span>&gt;</span><span> 4</span></blockquote>'
  },
  {
    name: 'not a quote',
    s: '3 > 4',
    mu: [
      {
        op: 2,
        cl: 3,
        typ: 'unsafe'
      }
    ],
    expected: '<span>3 </span><span>&gt;</span><span> 4</span>'
  },
  {
    name: 'quote from new line',
    s: '\n> b',
    mu: [
      {
        op: 0,
        oplen: 2,
        cl: 3,
        typ: 'quote'
      }
    ],
    expected: '<blockquote> </blockquote><span>b</span>'
  },
  {
    name: 'link only',
    s: '123 https://ya.ru 456',
    mu: [
      {
        op: 4,
        cl: 17,
        typ: 'link',
        url: 'https://ya.ru',
        repl: 'ya.ru'
      }
    ],
    expected: '<span>123 </span><a href="https://ya.ru">ya.ru</a><span> 456</span>'
  },
  {
    name: 'mailto',
    s: '123 xxx@gmail.com 456',
    mu: [
      {
        op: 4,
        cl: 17,
        typ: 'link',
        url: 'mailto:xxx@gmail.com',
        repl: 'xxx@gmail.com'
      }
    ],
    expected: '<span>123 </span><a href="mailto:xxx@gmail.com">xxx@gmail.com</a><span> 456</span>'
  },
  {
    name: 'link only with trailing slash',
    s: '123 https://ya.ru/? 456',
    mu: [
      {
        op: 4,
        cl: 19,
        typ: 'link',
        url: 'https://ya.ru/?',
        repl: 'ya.ru/?'
      }
    ],
    expected: '<span>123 </span><a href="https://ya.ru/?">ya.ru/?</a><span> 456</span>'
  },
  {
    name: 'manage.py',
    s: '123 manage.py 456',
    mu: [
      {
        op: 4,
        cl: 13,
        typ: 'link',
        url: 'http://manage.py',
        repl: 'manage.py'
      }
    ],
    expected: '<span>123 </span><a href="http://manage.py">manage.py</a><span> 456</span>'
  },
  {
    name: 'tag',
    s: '<br>',
    mu: [
      {
        op: 0,
        cl: 1,
        typ: 'unsafe'
      },
      {
        op: 3,
        cl: 4,
        typ: 'unsafe'
      }
    ],
    expected: '<span>&lt;</span><span>br</span><span>&gt;</span>'
  },
  {
    name: 'lt',
    s: '<<<<<<',
    mu: [
      {
        op: 0,
        cl: 1,
        typ: 'unsafe'
      },
      {
        op: 1,
        cl: 2,
        typ: 'unsafe'
      },
      {
        op: 2,
        cl: 3,
        typ: 'unsafe'
      },
      {
        op: 3,
        cl: 4,
        typ: 'unsafe'
      },
      {
        op: 4,
        cl: 5,
        typ: 'unsafe'
      },
      {
        op: 5,
        cl: 6,
        typ: 'unsafe'
      }
    ],
    expected: '<span>&lt;</span><span>&lt;</span><span>&lt;</span><span>&lt;</span><span>&lt;</span><span>&lt;</span>'
  },
  {
    name: 'bolditalic tag',
    s: '<b><i>123</i></b>',
    mu: [
      {
        op: 0,
        cl: 1,
        typ: 'unsafe'
      },
      {
        op: 2,
        cl: 3,
        typ: 'unsafe'
      },
      {
        op: 3,
        cl: 4,
        typ: 'unsafe'
      },
      {
        op: 5,
        cl: 6,
        typ: 'unsafe'
      },
      {
        op: 9,
        cl: 10,
        typ: 'unsafe'
      },
      {
        op: 12,
        cl: 13,
        typ: 'unsafe'
      },
      {
        op: 13,
        cl: 14,
        typ: 'unsafe'
      },
      {
        op: 16,
        cl: 17,
        typ: 'unsafe'
      }
    ],
    expected: '<span>&lt;</span><span>b</span><span>&gt;</span><span>&lt;</span><span>i</span><span>&gt;</span><span>123</span><span>&lt;</span><span>/i</span><span>&gt;</span><span>&lt;</span><span>/b</span><span>&gt;</span>'
  },
  {
    name: 'bold italic without markup',
    s: '<b>1 <i>2</i> 3</b>',
    mu: [
      {
        op: 0,
        cl: 1,
        typ: 'unsafe'
      },
      {
        op: 2,
        cl: 3,
        typ: 'unsafe'
      },
      {
        op: 5,
        cl: 6,
        typ: 'unsafe'
      },
      {
        op: 7,
        cl: 8,
        typ: 'unsafe'
      },
      {
        op: 9,
        cl: 10,
        typ: 'unsafe'
      },
      {
        op: 12,
        cl: 13,
        typ: 'unsafe'
      },
      {
        op: 15,
        cl: 16,
        typ: 'unsafe'
      },
      {
        op: 18,
        cl: 19,
        typ: 'unsafe'
      }
    ],
    expected: '<span>&lt;</span><span>b</span><span>&gt;</span><span>1 </span><span>&lt;</span><span>i</span><span>&gt;</span><span>2</span><span>&lt;</span><span>/i</span><span>&gt;</span><span> 3</span><span>&lt;</span><span>/b</span><span>&gt;</span>'
  },
  {
    name: 'tag after markup',
    s: '/*6688*/ 3<br>',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 7,
        cllen: 1,
        typ: 'italic',
        childs: [
          {
            op: 0,
            oplen: 1,
            cl: 5,
            cllen: 1,
            typ: 'bold'
          }
        ]
      },
      {
        op: 10,
        cl: 11,
        typ: 'unsafe'
      },
      {
        op: 13,
        cl: 14,
        typ: 'unsafe'
      }
    ],
    expected: '<i><b>6688</b></i><span> 3</span><span>&lt;</span><span>br</span><span>&gt;</span>'
  },
  {
    name: 'bold italic with markup',
    s: '<b>1 <i>2</i> /*6688*/ 3</b>',
    mu: [
      {
        op: 0,
        cl: 1,
        typ: 'unsafe'
      },
      {
        op: 2,
        cl: 3,
        typ: 'unsafe'
      },
      {
        op: 5,
        cl: 6,
        typ: 'unsafe'
      },
      {
        op: 7,
        cl: 8,
        typ: 'unsafe'
      },
      {
        op: 9,
        cl: 10,
        typ: 'unsafe'
      },
      {
        op: 12,
        cl: 13,
        typ: 'unsafe'
      },
      {
        op: 14,
        oplen: 1,
        cl: 21,
        cllen: 1,
        typ: 'italic',
        childs: [
          {
            op: 0,
            oplen: 1,
            cl: 5,
            cllen: 1,
            typ: 'bold'
          }
        ]
      },
      {
        op: 24,
        cl: 25,
        typ: 'unsafe'
      },
      {
        op: 27,
        cl: 28,
        typ: 'unsafe'
      }
    ],
    expected: '<span>&lt;</span><span>b</span><span>&gt;</span><span>1 </span><span>&lt;</span><span>i</span><span>&gt;</span><span>2</span><span>&lt;</span><span>/i</span><span>&gt;</span><span> </span><i><b>6688</b></i><span> 3</span><span>&lt;</span><span>/b</span><span>&gt;</span>'
  },
  {
    name: 'nested markup no spaces',
    s: '_1-*2-~34~-6*-7_',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 15,
        cllen: 1,
        typ: 'underscore'
      }
    ],
    expected: '<u>1-*2-~34~-6*-7</u>'
  },
  {
    name: 'date',
    s: '<2000-01-02T10:15:00.000000-0700>',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 32,
        cllen: 1,
        typ: 'time',
        time: '2000-01-02T10:15:00.000000-0700'
      }
    ],
    expected: '<time datetime="2000-01-02T10:15:00.000000-0700">1/2/2000, 8:15:00 PM</time>'
  },
  {
    name: 'date in text',
    s: 'Тестовая задача с крайним сроком <2020-11-12T13:00:45.795000Z>',
    mu: [
      {
        op: 33,
        oplen: 1,
        cl: 61,
        cllen: 1,
        typ: 'time',
        time: '2020-11-12T13:00:45.795000Z'
      }
    ],
    expected: '<span>Тестовая задача с крайним сроком </span><time datetime="2020-11-12T13:00:45.795000Z">11/12/2020, 4:00:45 PM</time>'
  },
  {
    name: 'clear-all',
    s: '_x_ ~y~ *z* /a/ `b` ```c```',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 2,
        cllen: 1,
        typ: 'underscore'
      },
      {
        op: 4,
        oplen: 1,
        cl: 6,
        cllen: 1,
        typ: 'strike'
      },
      {
        op: 8,
        oplen: 1,
        cl: 10,
        cllen: 1,
        typ: 'bold'
      },
      {
        op: 12,
        oplen: 1,
        cl: 14,
        cllen: 1,
        typ: 'italic'
      },
      {
        op: 16,
        oplen: 1,
        cl: 18,
        cllen: 1,
        typ: 'code'
      },
      {
        op: 20,
        oplen: 3,
        cl: 24,
        cllen: 3,
        typ: 'codeblock'
      }
    ],
    expected: '<u>x</u><span> </span><s>y</s><span> </span><b>z</b><span> </span><i>a</i><span> </span><code>b</code><span> </span><pre>c</pre>'
  },
  {
    name: 'username',
    s: 'aaa @user1_name1 @user2_name2',
    mu: [],
    expected: '<span>aaa @user1_name1 @user2_name2</span>'
  },
  {
    name: 'bold-username',
    s: 'aaa *@user1_name1 @user2_name2*',
    mu: [
      {
        op: 4,
        oplen: 1,
        cl: 30,
        cllen: 1,
        typ: 'bold'
      }
    ],
    expected: '<span>aaa </span><b>@user1_name1 @user2_name2</b>'
  },
  {
    name: 'punctuation',
    s: '_123_?',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 4,
        cllen: 1,
        typ: 'underscore'
      }
    ],
    expected: '<u>123</u><span>?</span>'
  },
  {
    name: 'double',
    s: '_123__ f',
    mu: [],
    expected: '<span>_123__ f</span>'
  },
  {
    name: 'double-double',
    s: '_123 _ f',
    mu: [],
    expected: '<span>_123 _ f</span>'
  },
  {
    name: 'emoji',
    s: '_hey_ *hop😂* _лалалей_',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 4,
        cllen: 1,
        typ: 'underscore'
      },
      {
        op: 6,
        oplen: 1,
        cl: 11,
        cllen: 1,
        typ: 'bold'
      },
      {
        op: 13,
        oplen: 1,
        cl: 21,
        cllen: 1,
        typ: 'underscore'
      }
    ],
    expected: '<u>hey</u><span> </span><b>hop😂</b><span> </span><u>лалалей</u>'
  },
  {
    name: 'code in the middle',
    s: 'привет `cod` рыба',
    mu: [
      {
        op: 7,
        oplen: 1,
        cl: 11,
        cllen: 1,
        typ: 'code'
      }
    ],
    expected: '<span>привет </span><code>cod</code><span> рыба</span>'
  },
  {
    name: 'bold and bold italic',
    s: '*bold /italic/*',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 14,
        cllen: 1,
        typ: 'bold',
        childs: [
          {
            op: 5,
            oplen: 1,
            cl: 12,
            cllen: 1,
            typ: 'italic'
          }
        ]
      }
    ],
    expected: '<b><span>bold </span><i>italic</i></b>'
  },
  {
    name: 'mix of plain and nested',
    s: 'plain *simple bold* plain again *bold with nested /italic/* /just italic/',
    mu: [
      {
        op: 6,
        oplen: 1,
        cl: 18,
        cllen: 1,
        typ: 'bold'
      },
      {
        op: 32,
        oplen: 1,
        cl: 58,
        cllen: 1,
        typ: 'bold',
        childs: [
          {
            op: 17,
            oplen: 1,
            cl: 24,
            cllen: 1,
            typ: 'italic'
          }
        ]
      },
      {
        op: 60,
        oplen: 1,
        cl: 72,
        cllen: 1,
        typ: 'italic'
      }
    ],
    expected: '<span>plain </span><b>simple bold</b><span> plain again </span><b><span>bold with nested </span><i>italic</i></b><span> </span><i>just italic</i>'
  },
  {
    name: 'double italic between plain',
    s: '12 /34/ 56 /89/ 90',
    mu: [
      {
        op: 3,
        oplen: 1,
        cl: 6,
        cllen: 1,
        typ: 'italic'
      },
      {
        op: 11,
        oplen: 1,
        cl: 14,
        cllen: 1,
        typ: 'italic'
      }
    ],
    expected: '<span>12 </span><i>34</i><span> 56 </span><i>89</i><span> 90</span>'
  },
  {
    name: 'bold with nested italic',
    s: '*bold with nested /italic/*',
    mu: [
      {
        op: 0,
        oplen: 1,
        cl: 26,
        cllen: 1,
        typ: 'bold',
        childs: [
          {
            op: 17,
            oplen: 1,
            cl: 24,
            cllen: 1,
            typ: 'italic'
          }
        ]
      }
    ],
    expected: '<b><span>bold with nested </span><i>italic</i></b>'
  },
  {
    name: 'plain and bold with nested italic',
    s: 'plain and *bold with nested /italic/*',
    mu: [
      {
        op: 10,
        oplen: 1,
        cl: 36,
        cllen: 1,
        typ: 'bold',
        childs: [
          {
            op: 17,
            oplen: 1,
            cl: 24,
            cllen: 1,
            typ: 'italic'
          }
        ]
      }
    ],
    expected: '<span>plain and </span><b><span>bold with nested </span><i>italic</i></b>'
  }
]

export default specs
