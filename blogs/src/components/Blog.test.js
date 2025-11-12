import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';
import { beforeEach, expect, test } from 'vitest';

describe('blog', () => {
    let container;
    const blog = {
        title: 'Test Blog Title',
        author: 'Matias',
        url: 'xxx.com',
        user: { name: 'Guido Serniotti' },
    };
    beforeEach(() => {
        container = render(<Blog blog={blog} />);
    });

    test('renders blog title and author only', () => {
        const children = container.container.querySelector(
            '.togglableContent-visible'
        );
        expect(children).toHaveStyle('display: none');
        expect(
            container.container.querySelector('.blog-title')
        ).toHaveTextContent('Test Blog Title by Matias');
    });

    test('show blog details info when user clicks view', async () => {
        const user = userEvent.setup();
        const viewButton = container.getByText('view');
        await user.click(viewButton);

        const children = container.container.querySelector(
            '.togglableContent-visible'
        );
        expect(children).not.toHaveStyle('display: none');
    });

    test('event called twice when like button is clicked twice', async () => {
        const user = userEvent.setup();
        const mockHandler = vi.fn();
        container.rerender(<Blog blog={blog} handleLikes={mockHandler} />);
        const likeButton = screen.getByText('like');
        await user.click(likeButton);
        await user.click(likeButton);
        expect(mockHandler).toHaveBeenCalledTimes(2);
    });
});
