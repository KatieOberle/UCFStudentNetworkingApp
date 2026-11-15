import 'package:flutter/material.dart';

class Thread {
  final String id;
  final String title;
  final String body;
  final String authorName;
  final String? createdAt;
  final bool isOwnThread;

  const Thread({
    required this.id,
    required this.title,
    required this.body,
    required this.authorName,
    this.createdAt,
    this.isOwnThread = false,
  });
}

class ThreadReply {
  final String id;
  final String body;
  final String authorName;
  final String? createdAt;
  final bool isOwnReply;

  const ThreadReply({
    required this.id,
    required this.body,
    required this.authorName,
    this.createdAt,
    this.isOwnReply = false,
  });
}

class ThreadDetailPage extends StatefulWidget {
  final Thread? thread;
  final List<ThreadReply> replies;
  final VoidCallback onBackClick;
  final Future<void> Function(String body)? onSubmitReply;
  final Future<void> Function(String threadId)? onDeleteThread;
  final Future<void> Function(String replyId)? onDeleteReply;

  const ThreadDetailPage({
    super.key,
    this.thread,
    this.replies = const [],
    required this.onBackClick,
    this.onSubmitReply,
    this.onDeleteThread,
    this.onDeleteReply,
  });

  @override
  State<ThreadDetailPage> createState() => _ThreadDetailPageState();
}

class _ThreadDetailPageState extends State<ThreadDetailPage> {
  final TextEditingController _replyController = TextEditingController();
  String _error = '';
  bool _submitting = false;
  String? _deletingId;

  @override
  void dispose() {
    _replyController.dispose();
    super.dispose();
  }

  Future<void> _submitReply() async {
    final body = _replyController.text.trim();
    setState(() => _error = '');
    if (body.isEmpty) {
      setState(() => _error = 'Please write a reply before submitting.');
      return;
    }
    if (widget.onSubmitReply == null) {
      setState(() => _error = 'Reply posting is not connected to the server yet.');
      return;
    }
    setState(() => _submitting = true);
    try {
      await widget.onSubmitReply!(body);
      if (!mounted) return;
      _replyController.clear();
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'Unable to post your reply. Please try again.');
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  Future<bool> _confirmDelete(String message) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Confirm deletion'),
            content: Text(message),
            actions: [
              TextButton(
                onPressed: () => Navigator.pop(context, false),
                child: const Text('Cancel'),
              ),
              FilledButton(
                onPressed: () => Navigator.pop(context, true),
                child: const Text('Delete'),
              ),
            ],
          ),
        ) ??
        false;
  }

  Future<void> _deleteThread() async {
    final thread = widget.thread;
    if (thread == null || !thread.isOwnThread || widget.onDeleteThread == null) {
      setState(() => _error = 'Thread deletion is not available.');
      return;
    }
    if (!await _confirmDelete('Are you sure you want to delete this thread?')) return;
    if (!mounted) return;
    setState(() {
      _deletingId = thread.id;
      _error = '';
    });
    try {
      await widget.onDeleteThread!(thread.id);
      if (!mounted) return;
      widget.onBackClick();
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'Unable to delete this thread.');
    } finally {
      if (mounted) setState(() => _deletingId = null);
    }
  }

  Future<void> _deleteReply(ThreadReply reply) async {
    if (!reply.isOwnReply || widget.onDeleteReply == null) {
      setState(() => _error = 'Reply deletion is not available.');
      return;
    }
    if (!await _confirmDelete('Delete this reply?')) return;
    if (!mounted) return;
    setState(() {
      _deletingId = reply.id;
      _error = '';
    });
    try {
      await widget.onDeleteReply!(reply.id);
    } catch (_) {
      if (!mounted) return;
      setState(() => _error = 'Unable to delete this reply.');
    } finally {
      if (mounted) setState(() => _deletingId = null);
    }
  }

  Widget _sectionCard(Widget child) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: child,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final thread = widget.thread;
    final replies = widget.replies;

    return Scaffold(
      appBar: AppBar(
        title: const Text('KnightLink'),
        actions: [
          TextButton(
            onPressed: widget.onBackClick,
            child: const Text('Back to Discussions'),
          ),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1000),
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              if (thread == null) ...[
                Text('Thread Details', style: Theme.of(context).textTheme.headlineMedium),
                const SizedBox(height: 16),
                _sectionCard(const Text('Select a discussion to view its details and replies.')),
              ] else ...[
                _sectionCard(Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Wrap(
                      spacing: 12,
                      runSpacing: 12,
                      crossAxisAlignment: WrapCrossAlignment.center,
                      children: [
                        Text(thread.title, style: Theme.of(context).textTheme.headlineMedium),
                        if (thread.isOwnThread)
                          OutlinedButton(
                            onPressed: _deletingId == null ? _deleteThread : null,
                            child: Text(_deletingId == thread.id ? 'Deleting...' : 'Delete Thread'),
                          ),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Posted by ${thread.authorName}${thread.createdAt == null ? '' : ' • ${thread.createdAt}'}',
                      style: Theme.of(context).textTheme.bodySmall,
                    ),
                    const SizedBox(height: 20),
                    Text(thread.body),
                  ],
                )),
                const SizedBox(height: 20),
                Text('Replies (${replies.length})', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 12),
                if (replies.isEmpty)
                  _sectionCard(const Center(child: Text('No replies yet. Be the first to respond!')))
                else
                  ...replies.map((reply) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: _sectionCard(Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(reply.authorName, style: const TextStyle(fontWeight: FontWeight.bold)),
                                      if (reply.createdAt != null)
                                        Text(reply.createdAt!, style: Theme.of(context).textTheme.bodySmall),
                                    ],
                                  ),
                                ),
                                if (reply.isOwnReply)
                                  TextButton(
                                    onPressed: _deletingId == null ? () => _deleteReply(reply) : null,
                                    child: Text(_deletingId == reply.id ? 'Deleting...' : 'Delete'),
                                  ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(reply.body),
                          ],
                        )),
                      )),
                const SizedBox(height: 20),
                Text('Write a Reply', style: Theme.of(context).textTheme.titleLarge),
                const SizedBox(height: 12),
                TextField(
                  controller: _replyController,
                  maxLines: 5,
                  minLines: 5,
                  decoration: const InputDecoration(
                    labelText: 'Your Reply',
                    hintText: 'Share your thoughts...',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 12),
                if (_error.isNotEmpty) ...[
                  Text(_error, style: TextStyle(color: Theme.of(context).colorScheme.error)),
                  const SizedBox(height: 12),
                ],
                Align(
                  alignment: Alignment.centerLeft,
                  child: FilledButton(
                    onPressed: _submitting ? null : _submitReply,
                    child: Text(_submitting ? 'Posting...' : 'Post Reply'),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}
