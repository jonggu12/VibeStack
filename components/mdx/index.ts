// MDX 커스텀 컴포넌트들
export { Callout } from './callout'
export { CodeBlock } from './code-block'
export { Checkpoint } from './checkpoint'
export { Quiz } from './quiz'
export { Step, Steps } from './step'

// MDX에서 사용할 컴포넌트 맵
import { Callout } from './callout'
import { CodeBlock } from './code-block'
import { Checkpoint } from './checkpoint'
import { Quiz } from './quiz'
import { Step, Steps } from './step'

export const mdxComponents = {
    Callout,
    CodeBlock,
    Checkpoint,
    Quiz,
    Step,
    Steps,
}
