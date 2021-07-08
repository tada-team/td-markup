import tdmarkup, { MarkupEntity } from './index'

const specs: {
  name: string,
  s: string,
  mu: MarkupEntity[],
  expected: string
}[] = [
  {
    name: 'noop',
    s: '123',
    mu: [],
    expected: '<div><span>123</span></div>'
  },
  {
    name: 'empty bold',
    s: '**',
    mu: [],
    expected: '<div><span>**</span></div>'
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
    expected: '<div><b>1</b></div>'
  },
  {
    name: 'bold is inline only',
    s: '123 *45\n6* 789',
    mu: [],
    expected: '<div><span>123 *45\n6* 789</span></div>'
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
    expected: '<div><span>привет, </span><b>ромашки!</b></div>'
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
    expected: '<div><b>123</b></div>'
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
    expected: '<div><b>123</b><span>!</span></div>'
  },
  {
    name: 'not a bold',
    s: '*123\n456*',
    mu: [],
    expected: '<div><span>*123\n456*</span></div>'
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
    expected: '<div><span>123 </span><b>456</b></div>'
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
    expected: '<div><span>123 </span><b>456</b><span>\n</span><b>789</b></div>'
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
    expected: '<div><span>123 </span><b>456</b><span> 789 </span><b>10</b></div>'
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
    expected: '<div><code>123</code></div>'
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
    expected: '<div><code>*123*</code></div>'
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
    expected: '<div><code>123 ~456~ </code></div>'
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
    expected: '<div><span>example: </span><code> 123 ~456~ </code></div>'
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
    expected: '<div><span>123 </span><i>456</i><span> 789</span></div>'
  },
  {
    name: 'not italic',
    s: '123 / 456/ 789',
    mu: [],
    expected: '<div><span>123 / 456/ 789</span></div>'
  },
  {
    name: 'not italic 2',
    s: '123 / 456 / 789',
    mu: [],
    expected: '<div><span>123 / 456 / 789</span></div>'
  },
  {
    name: 'not italic 3',
    s: '123/ 456 /789',
    mu: [],
    expected: '<div><span>123/ 456 /789</span></div>'
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
    expected: '<div><a href="https://ya.ru/">ya.ru</a></div>'
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
    expected: '<div><b><i>123</i></b></div>'
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
    expected: '<div><pre>code</pre></div>'
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
    expected: '<div><pre>code\nnl</pre></div>'
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
    expected: '<div><pre>code\nline</pre></div>'
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
    expected: '<div><pre>code\nline</pre></div>'
  },
  {
    name: 'code incomplete',
    s: '```code\nnl``',
    mu: [],
    expected: '<div><span>```code\nnl``</span></div>'
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
    expected: '<div><span>123 </span><i><span>4 </span><b>5</b><span> 6</span></i><span> 789</span></div>'
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
    expected: '<div><blockquote>123</blockquote><span>456</span></div>'
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
    expected: '<div><blockquote>123</blockquote></div>'
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
    expected: '<div><blockquote><span>12 </span><b>3</b></blockquote><span>456</span></div>'
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
    expected: '<div><blockquote><span>3 </span><span>&gt;</span><span> 4</span></blockquote></div>'
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
    expected: '<div><span>3 </span><span>&gt;</span><span> 4</span></div>'
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
    expected: '<div><blockquote> </blockquote><span>b</span></div>'
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
    expected: '<div><span>123 </span><a href="https://ya.ru">ya.ru</a><span> 456</span></div>'
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
    expected: '<div><span>123 </span><a href="mailto:xxx@gmail.com">xxx@gmail.com</a><span> 456</span></div>'
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
    expected: '<div><span>123 </span><a href="https://ya.ru/?">ya.ru/?</a><span> 456</span></div>'
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
    expected: '<div><span>123 </span><a href="http://manage.py">manage.py</a><span> 456</span></div>'
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
    expected: '<div><span>&lt;</span><span>br</span><span>&gt;</span></div>'
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
    expected: '<div><span>&lt;</span><span>&lt;</span><span>&lt;</span><span>&lt;</span><span>&lt;</span><span>&lt;</span></div>'
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
    expected: '<div><span>&lt;</span><span>b</span><span>&gt;</span><span>&lt;</span><span>i</span><span>&gt;</span><span>123</span><span>&lt;</span><span>/i</span><span>&gt;</span><span>&lt;</span><span>/b</span><span>&gt;</span></div>'
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
    expected: '<div><span>&lt;</span><span>b</span><span>&gt;</span><span>1 </span><span>&lt;</span><span>i</span><span>&gt;</span><span>2</span><span>&lt;</span><span>/i</span><span>&gt;</span><span> 3</span><span>&lt;</span><span>/b</span><span>&gt;</span></div>'
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
    expected: '<div><i><b>6688</b></i><span> 3</span><span>&lt;</span><span>br</span><span>&gt;</span></div>'
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
    expected: '<div><span>&lt;</span><span>b</span><span>&gt;</span><span>1 </span><span>&lt;</span><span>i</span><span>&gt;</span><span>2</span><span>&lt;</span><span>/i</span><span>&gt;</span><span> </span><i><b>6688</b></i><span> 3</span><span>&lt;</span><span>/b</span><span>&gt;</span></div>'
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
    expected: '<div><u>1-*2-~34~-6*-7</u></div>'
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
    expected: '<div><time datetime="2000-01-02T10:15:00.000000-0700">1/2/2000, 8:15:00 PM</time></div>'
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
    expected: '<div><span>Тестовая задача с крайним сроком </span><time datetime="2020-11-12T13:00:45.795000Z">11/12/2020, 4:00:45 PM</time></div>'
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
    expected: '<div><u>x</u><span> </span><s>y</s><span> </span><b>z</b><span> </span><i>a</i><span> </span><code>b</code><span> </span><pre>c</pre></div>'
  },
  {
    name: 'username',
    s: 'aaa @user1_name1 @user2_name2',
    mu: [],
    expected: '<div><span>aaa @user1_name1 @user2_name2</span></div>'
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
    expected: '<div><span>aaa </span><b>@user1_name1 @user2_name2</b></div>'
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
    expected: '<div><u>123</u><span>?</span></div>'
  },
  {
    name: 'double',
    s: '_123__ f',
    mu: [],
    expected: '<div><span>_123__ f</span></div>'
  },
  {
    name: 'double-double',
    s: '_123 _ f',
    mu: [],
    expected: '<div><span>_123 _ f</span></div>'
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
    expected: '<div><u>hey</u><span> </span><b>hop😂</b><span> </span><u>лалалей</u></div>'
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
    expected: '<div><span>привет </span><code>cod</code><span> рыба</span></div>'
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
    expected: '<div><b><span>bold </span><i>italic</i></b></div>'
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
    expected: '<div><span>plain </span><b>simple bold</b><span> plain again </span><b><span>bold with nested </span><i>italic</i></b><span> </span><i>just italic</i></div>'
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
    expected: '<div><span>12 </span><i>34</i><span> 56 </span><i>89</i><span> 90</span></div>'
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
    expected: '<div><b><span>bold with nested </span><i>italic</i></b></div>'
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
    expected: '<div><span>plain and </span><b><span>bold with nested </span><i>italic</i></b></div>'
  }
]

export default specs
