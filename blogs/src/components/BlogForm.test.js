import { render, screen } from '@testing-library/react';
import BlogForm from './BlogForm';
import userEvent from '@testing-library/user-event';

describe('BlogForm', () => {
    test('"new blog" form calls event handler with correct details', async () => {
        const createBlog = vi.fn();
        const user = userEvent.setup();
        const form = render(<BlogForm createBlog={createBlog} />);

        const title_input = form.container.querySelector(
            '.blogform-title-input'
        );
        const author_input = form.container.querySelector(
            '.blogform-author-input'
        );
        const url_input = form.container.querySelector('.blogform-url-input');

        const sendButton = screen.getByText('Crear');

        await user.type(title_input, 'testing a form...');
        await user.type(author_input, 'Matias');
        await user.type(url_input, 'xxx.com');
        await user.click(sendButton);

        expect(createBlog.mock.calls).toHaveLength(1);

        expect(createBlog.mock.calls[0][0].title).toBe('testing a form...');
        expect(createBlog.mock.calls[0][0].author).toBe('Matias');
        expect(createBlog.mock.calls[0][0].url).toBe('xxx.com');
    });
});
